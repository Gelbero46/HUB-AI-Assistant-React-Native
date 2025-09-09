# Hub AI Assistant App

A React Native application with voice calling capabilities powered by Twilio Voice SDK and Clerk authentication.

## 🚀 Features

- **Voice Calls**: Make and receive calls using Twilio Voice SDK
- **Authentication**: Secure user authentication with Clerk
- **Call Transcription**: Automatic call transcription and recording
- **Cross-Platform**: Runs on both iOS and Android
- **Real-time Updates**: Live call status and statistics

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- React Native development environment set up
- Expo CLI installed globally
- A Twilio account with a purchased phone number
- A Clerk account for authentication
- ngrok for local development tunneling

## 🏗️ Project Structure

```
ai-voice-assistant/
├── mobile/                 # React Native App (Expo)
│   ├── package.json
│   ├── app.json
│   ├── src/
│   └── hooks/
├── server/                 # Node.js Backend
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── routes/
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clerk Authentication Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key to your environment:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
```

### 2. Twilio Console Configuration

#### 2.1 Create API Key (Recommended for Production)

1. Navigate to **Twilio Console → Settings → API Keys**
2. Click **"Create API Key"**
3. Configure:
   - **Name**: `AI Voice Assistant`
   - **Key Type**: `Standard`
4. Save the credentials:
   ```bash
   TWILIO_API_KEY=SKxxxxxxxxxxxxxxxx
   TWILIO_API_SECRET=your_api_secret_here
   ```

#### 2.2 Create TwiML Application

1. Go to **Twilio Console → Voice → TwiML Apps**
2. Click **"Create new TwiML App"**
3. Configure:
   - **Name**: `AI Voice Assistant App`
   - **Voice Request URL**: `https://your-ngrok-url.ngrok.app/api/voice/outgoing`
   - **HTTP Method**: `POST`
4. Save and copy the **Application SID**:
   ```bash
   TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxx
   ```

#### 2.3 Configure Phone Number

1. Navigate to **Phone Numbers → Manage → Active Numbers**
2. Click on your purchased number
3. Configure Voice settings:
   - **Configure with**: `TwiML App`
   - **TwiML App**: Select your created app
4. Save configuration

#### 2.4 Gather Required Credentials

From **Twilio Console → Settings → General**:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

### 3. Server Setup

1. Navigate to server directory:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file with your credentials:
   ```bash
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
   TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxx
   
   # Optional: API Key/Secret (recommended for production)
   TWILIO_API_KEY=SKxxxxxxxxxxxxxxxx
   TWILIO_API_SECRET=your_api_secret_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:8081,https://your-ngrok-url.ngrok.app
   
   # Optional Features
   ENABLE_RECORDING=true
   ALLOW_INCOMING_CALLS=false
   TOKEN_TTL=3600
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Set up ngrok tunnel:
   ```bash
   ngrok http 3000
   ```

5. Update your TwiML App webhook URLs with the ngrok URL

### 4. Mobile App Setup

1. Navigate to mobile directory:
   ```bash
   cd mobile
   npm install
   ```

2. Update server URL in `hooks/useCall.js`:
   ```javascript
   const SERVER_URL = 'https://your-ngrok-url.ngrok.app';
   ```

3. Start the development server:
   ```bash
   npx expo start --dev-client
   ```

4. Build and run on device (first time only):
   ```bash
   # For Android
   npx expo run:android # npx expo run:ios
   
   # For iOS  
   npx expo run:ios
   ```

## 🧪 Testing the Application

### 1. Health Check
Visit `https://your-ngrok-url.ngrok.app/health` to verify server status

### 2. Voice Call Flow
1. Open the mobile app and authenticate with Clerk
2. Navigate to the CallScreen
3. Enter a valid phone number
4. Initiate the call - target phone should ring
5. Answer the call and test features:
   - Mute/unmute
   - Speaker on/off  
   - End call
6. Check call transcript after completion

### 3. API Testing
```javascript
// Get call transcript
const transcript = await fetch(`${SERVER_URL}/api/transcript/${callSid}`);
const data = await transcript.json();
console.log('Call transcript:', data);

// Get call statistics
const stats = await fetch(`${SERVER_URL}/api/stats/${userIdentity}`);
const statsData = await stats.json();
console.log('User stats:', statsData);
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/health` | GET | Server health check |
| `/api/token` | POST | Generate Twilio access token |
| `/api/voice/outgoing` | POST | Handle outgoing call TwiML |
| `/api/voice/incoming` | POST | Handle incoming call TwiML |
| `/api/transcript/:callSid` | GET | Get call transcript |
| `/api/calls/:userIdentity` | GET | Get user call history |
| `/api/stats/:userIdentity` | GET | Get user call statistics |

## 🔧 Environment Variables

### Server (.env)
```bash
# Required
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_TWIML_APP_SID=

# Optional (Production Recommended)
TWILIO_API_KEY=
TWILIO_API_SECRET=

# Server Config
PORT=3000
ALLOWED_ORIGINS=
ENABLE_RECORDING=true
```

### Mobile App
```bash
# Required
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid TwiML Application SID"**
   - Verify `TWILIO_TWIML_APP_SID` is correct
   - Ensure TwiML app webhook URLs are properly configured

2. **Call not connecting**
   - Check ngrok tunnel is active
   - Verify phone number format (+1xxxxxxxxxx)
   - Ensure Twilio phone number is configured correctly

3. **Token generation fails**
   - Verify all Twilio credentials are correct
   - Check API key permissions if using API keys

### Logs and Debugging

- Server logs: Check console output for detailed error messages
- Twilio logs: Monitor at **Twilio Console → Monitor → Logs → Errors**
- Mobile logs: Use React Native debugger or Expo logs

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check [Twilio Voice SDK documentation](https://www.twilio.com/docs/voice/sdks)
- Review [Clerk React Native documentation](https://clerk.com/docs/quickstarts/expo)