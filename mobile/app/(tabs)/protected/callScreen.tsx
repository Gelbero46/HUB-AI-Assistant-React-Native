import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  Grid3x3,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useCall } from '@/hooks';
import { RootStackParamList } from '@/types';
import { CallStatus } from '@/constants';
// import { createCallScreenStyles } from '@constants/styles/CallScreen.styles';
import { createCallScreenStyles } from '@/constants/styles/CallScreen.styles';
import { useTheme } from '@/context/theme-context';

type CallScreenRouteProp = RouteProp<RootStackParamList, 'CallScreen'>;

const CallScreen: React.FC = () => {
  const route = useRoute<CallScreenRouteProp>();
  const navigation = useNavigation();
  const { colors, fonts, sizes } = useTheme();
  const { contactId, phoneNumber } = route.params ?? {};
  
const {
  currentCall,
  makeCall,
  endCall,
  toggleMute: handleToggleMute,
  toggleSpeaker: handleToggleSpeaker,
  isMuted,
  isSpeakerOn,
  callStatus,
  error: callError,
  isInitialized
} = useCall();

  const [callDuration, setCallDuration] = useState(0);
  // const [isMuted, setIsMuted] = useState(false);
  // const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const styles = useMemo(() => 
    createCallScreenStyles(colors, fonts, sizes ), 
    [colors, fonts]
  );

 // Make call when screen loads
useEffect(() => {
  if (!currentCall && phoneNumber && isInitialized) {
    makeCall(phoneNumber, contactId).catch((error) => {
      console.error('Failed to initiate call:', error);
      Alert.alert("Failed to make call")
    });
  }
}, [phoneNumber, contactId, currentCall, makeCall, isInitialized]);

// Track call duration
useEffect(() => {
  let interval: ReturnType<typeof setInterval>;
  
  if (callStatus === CallStatus.CONNECTED) {
    interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [callStatus]);

  useEffect(() => {
    // Pulse animation for connecting state
    if (currentCall?.status === CallStatus.CONNECTING) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(pulse);
      };
      pulse();
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // const handleEndCall = async () => {
  //   await endCall();
  //   navigation.goBack();
  // };

  // const handleEndCall = () => {
  //   navigation.goBack();
  // };

const handleEndCall = async (): Promise<void> => {
  try {
    await endCall();
    navigation.goBack();
  } catch (error) {
    console.error('Error ending call:', error);
    navigation.goBack(); // Navigate back anyway
  }
};

  const toggleMute = async (): Promise<void> => {
    try {
      await handleToggleMute();
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const toggleSpeaker = async (): Promise<void> => {
    try {
      await handleToggleSpeaker();
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };

  const getStatusText = (): string => {
    if (!isInitialized) {
      return 'Initializing...';
    }
    
    switch (callStatus) {
      case CallStatus.CONNECTING:
        return 'Connecting...';
      case CallStatus.CONNECTED:
        return formatDuration(callDuration);
      case CallStatus.FAILED:
        return 'Call Failed';
      case CallStatus.DISCONNECTED:
        return 'Call Ended';
      default:
        return 'Calling...';
    }
  };

  // const getStatusText = () => {
  //   return 'Connecting...';
  // };

  // const contactName = currentCall?.contact.name || phoneNumber;
  const contactName = currentCall?.contact.name || phoneNumber || 'Unknown';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[
          styles.avatar,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Text style={styles.avatarText}>
            {contactName.charAt(0).toUpperCase()}
          </Text>
        </Animated.View>
        
        <Text style={styles.name}>{contactName}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{callError ? callError : getStatusText()}</Text>
        </View>
        
        <Text style={styles.phone}>{phoneNumber}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, isMuted && styles.actionButtonActive]}
          onPress={toggleMute}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconContainer}>
            {isMuted ? (
              <MicOff 
                size={28} 
                color={isMuted ? colors.text : "#8E8E93"} 
              />
            ) : (
              <Mic 
                size={28} 
                color={colors.text} 
              />
            )}
          </View>
          <Text style={styles.actionLabel}>
            {isMuted ? 'Unmute' : 'Mute'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isSpeakerOn && styles.actionButtonActive]}
          onPress={toggleSpeaker}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconContainer}>
            {isSpeakerOn ? (
              <Volume2 
                size={28} 
                color={isSpeakerOn ? colors.text : "#8E8E93"} 
              />
            ) : (
              <VolumeX 
                size={28} 
                color="#8E8E93"
              />
            )}
          </View>
          <Text style={styles.actionLabel}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Keypad')}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconContainer}>
            <Grid3x3 
              size={28} 
              color={"#8E8E93"} 
            />
          </View>
          <Text style={styles.actionLabel}>Keypad</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
          activeOpacity={0.8}
        >
          <PhoneOff 
            size={32} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallScreen;