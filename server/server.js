const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const tokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 token requests per windowMs
  message: { error: 'Too many token requests, please try again later' }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});

// Apply rate limiting to all requests
app.use(generalLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Store call records - In production, use a proper database
const callRecords = new Map();

// Middleware for request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Validation middleware
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }
    next();
  };
};

// Input sanitization
const sanitizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure it starts with + for international format
  if (!cleaned.startsWith('+')) {
    // Assume US number if no country code
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    }
  }
  
  return cleaned;
};

// Health check with more detailed info
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.json(healthInfo);
});

// Generate access token for React Native client
app.post('/api/token', tokenLimiter, async (req, res) => {
  try {
    const identity = req.body.identity || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate identity format
    if (!/^[a-zA-Z0-9_-]+$/.test(identity)) {
      return res.status(400).json({
        error: 'Invalid identity format. Use only alphanumeric characters, underscores, and hyphens.'
      });
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Use proper API Key and Secret if available
    const accessToken = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN,
      { 
        identity,
        ttl: parseInt(process.env.TOKEN_TTL) || 3600 // Default 1 hour
      }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: process.env.ALLOW_INCOMING_CALLS === 'true' || false,
    });

    accessToken.addGrant(voiceGrant);

    const tokenString = accessToken.toJwt();
    
    // Log token generation (without exposing the actual token)
    console.log(`Generated access token for identity: ${identity}`);

    res.json({
      accessToken: tokenString,
      identity,
      expiresAt: new Date(Date.now() + (parseInt(process.env.TOKEN_TTL) || 3600) * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ 
      error: 'Failed to generate access token',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// TwiML endpoint for outgoing calls
app.post('/api/voice/outgoing', (req, res) => {
  try {
    const { To: targetNumber, From: callerIdentity, CallSid } = req.body;

    // Sanitize phone number
    const cleanedNumber = sanitizePhoneNumber(targetNumber);
    if (!cleanedNumber) {
      return res.status(400).type('text/xml').send(`
        <Response>
          <Say voice="alice">Invalid phone number format.</Say>
          <Hangup/>
        </Response>
      `);
    }

    console.log(`Outgoing call from ${callerIdentity} to ${cleanedNumber}`);

    // Store call info
    if (CallSid) {
      callRecords.set(CallSid, {
        from: callerIdentity,
        to: cleanedNumber,
        originalTo: targetNumber,
        startTime: new Date(),
        status: 'initiated',
        type: 'outbound'
      });
    }

    // Enhanced TwiML response
    const baseUrl = process.env.BASE_URL || process.env.NGROK_URL || `http://localhost:${PORT}`;
    
    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Connecting your call now.</Say>
        <Dial 
          callerId="${process.env.TWILIO_PHONE_NUMBER}"
          record="${process.env.ENABLE_RECORDING === 'true' ? 'record-from-ringing-dual' : 'do-not-record'}"
          recordingStatusCallback="${baseUrl}/api/recording/callback"
          timeout="30"
          hangupOnStar="true"
          action="${baseUrl}/api/voice/status"
        >
          <Number>${cleanedNumber}</Number>
        </Dial>
      </Response>
    `);
  } catch (error) {
    console.error('Error in outgoing call handler:', error);
    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Sorry, we encountered an error. Please try again later.</Say>
        <Hangup/>
      </Response>
    `);
  }
});

// Handle incoming calls (optional)
app.post('/api/voice/incoming', (req, res) => {
  try {
    const { From: callerNumber, CallSid } = req.body;
    
    console.log(`Incoming call from ${callerNumber}`);
    
    if (CallSid) {
      callRecords.set(CallSid, {
        from: callerNumber,
        to: 'incoming',
        startTime: new Date(),
        status: 'ringing',
        type: 'inbound'
      });
    }

    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Thank you for calling. Please hold while we connect you.</Say>
        <Hangup/>
      </Response>
    `);
  } catch (error) {
    console.error('Error in incoming call handler:', error);
    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Sorry, we cannot take your call right now.</Say>
        <Hangup/>
      </Response>
    `);
  }
});

// Handle call status updates
app.post('/api/voice/status', (req, res) => {
  try {
    const { CallSid, CallStatus, Duration, DialCallStatus } = req.body;

    console.log(`Call ${CallSid} status: ${CallStatus}, Dial status: ${DialCallStatus}`);

    if (callRecords.has(CallSid)) {
      const record = callRecords.get(CallSid);
      record.status = CallStatus;
      record.dialStatus = DialCallStatus;
      record.duration = Duration;
      
      if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(CallStatus)) {
        record.endTime = new Date();
      }
      
      callRecords.set(CallSid, record);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in status callback:', error);
    res.status(500).send('Error');
  }
});

// Handle recording callbacks
app.post('/api/recording/callback', (req, res) => {
  try {
    const { CallSid, RecordingUrl, RecordingDuration, RecordingSid } = req.body;

    console.log(`Recording ready for call ${CallSid}: ${RecordingUrl}`);

    if (callRecords.has(CallSid)) {
      const record = callRecords.get(CallSid);
      record.recordingUrl = RecordingUrl;
      record.recordingDuration = RecordingDuration;
      record.recordingSid = RecordingSid;
      callRecords.set(CallSid, record);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in recording callback:', error);
    res.status(500).send('Error');
  }
});

// Handle transcription callbacks
app.post('/api/transcription/callback', (req, res) => {
  try {
    const { CallSid, TranscriptionText, TranscriptionStatus, TranscriptionSid } = req.body;

    console.log(`Transcription for call ${CallSid}: ${TranscriptionStatus}`);

    if (callRecords.has(CallSid)) {
      const record = callRecords.get(CallSid);
      record.transcriptionText = TranscriptionText;
      record.transcriptionStatus = TranscriptionStatus;
      record.transcriptionSid = TranscriptionSid;
      callRecords.set(CallSid, record);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in transcription callback:', error);
    res.status(500).send('Error');
  }
});

// Get call transcript
app.get('/api/transcript/:callSid', (req, res) => {
  try {
    const { callSid } = req.params;

    if (!callSid || !/^CA[a-f0-9]{32}$/.test(callSid)) {
      return res.status(400).json({ error: 'Invalid call SID format' });
    }

    if (!callRecords.has(callSid)) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const record = callRecords.get(callSid);
    
    res.json({
      callSid,
      transcript: record.transcriptionText || null,
      status: record.transcriptionStatus || 'pending',
      duration: record.duration,
      recordingUrl: record.recordingUrl,
      callInfo: {
        from: record.from,
        to: record.to,
        startTime: record.startTime,
        endTime: record.endTime,
        type: record.type
      }
    });
  } catch (error) {
    console.error('Error getting transcript:', error);
    res.status(500).json({ error: 'Failed to retrieve transcript' });
  }
});

// Get all call records for a user (with pagination)
app.get('/api/calls/:userIdentity', (req, res) => {
  try {
    const { userIdentity } = req.params;
    const { limit = 50, offset = 0, status, type } = req.query;

    // Validate identity
    if (!/^[a-zA-Z0-9_-]+$/.test(userIdentity)) {
      return res.status(400).json({ error: 'Invalid user identity format' });
    }

    let userCalls = Array.from(callRecords.entries())
      .filter(([_, record]) => record.from === userIdentity);

    // Apply filters
    if (status) {
      userCalls = userCalls.filter(([_, record]) => record.status === status);
    }
    
    if (type) {
      userCalls = userCalls.filter(([_, record]) => record.type === type);
    }

    // Sort by start time (newest first)
    userCalls.sort(([, a], [, b]) => new Date(b.startTime) - new Date(a.startTime));

    // Apply pagination
    const total = userCalls.length;
    const paginatedCalls = userCalls
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(([callSid, record]) => ({
        callSid,
        to: record.to,
        duration: record.duration,
        startTime: record.startTime,
        endTime: record.endTime,
        status: record.status,
        type: record.type,
        hasTranscript: !!record.transcriptionText,
        hasRecording: !!record.recordingUrl
      }));

    res.json({ 
      calls: paginatedCalls,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Error getting call history:', error);
    res.status(500).json({ error: 'Failed to retrieve call history' });
  }
});

// Delete call record (for privacy compliance)
app.delete('/api/calls/:callSid', (req, res) => {
  try {
    const { callSid } = req.params;
    
    if (callRecords.has(callSid)) {
      callRecords.delete(callSid);
      res.json({ message: 'Call record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Call record not found' });
    }
  } catch (error) {
    console.error('Error deleting call record:', error);
    res.status(500).json({ error: 'Failed to delete call record' });
  }
});

// Get call statistics
app.get('/api/stats/:userIdentity', (req, res) => {
  try {
    const { userIdentity } = req.params;
    
    const userCalls = Array.from(callRecords.values())
      .filter(record => record.from === userIdentity);

    const stats = {
      totalCalls: userCalls.length,
      completedCalls: userCalls.filter(call => call.status === 'completed').length,
      totalDuration: userCalls.reduce((sum, call) => sum + (parseInt(call.duration) || 0), 0),
      averageDuration: 0,
      callsWithTranscripts: userCalls.filter(call => call.transcriptionText).length,
      callsWithRecordings: userCalls.filter(call => call.recordingUrl).length
    };

    if (stats.completedCalls > 0) {
      const completedCalls = userCalls.filter(call => call.status === 'completed');
      const totalDuration = completedCalls.reduce((sum, call) => sum + (parseInt(call.duration) || 0), 0);
      stats.averageDuration = Math.round(totalDuration / completedCalls.length);
    }

    res.json(stats);
  } catch (error) {
    console.error('Error getting call stats:', error);
    res.status(500).json({ error: 'Failed to retrieve call statistics' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📞 Twilio configured: ${!!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;