import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
// import { useCall } from '../hooks';
import { Colors, Sizes, Fonts, CallStatus } from '@/constants';
import { RootStackParamList } from '@/types';

type CallScreenRouteProp = RouteProp<RootStackParamList, 'CallScreen'>;

export const CallScreen: React.FC = () => {
  const route = useRoute<CallScreenRouteProp>();
  const navigation = useNavigation();
  const { contactId, phoneNumber } = route.params;
  
  // const {
  //   currentCall,
  //   makeCall,
  //   endCall,
  //   answerCall,
  //   rejectCall,
  //   toggleMute,
  //   toggleSpeaker,
  //   isMuted,
  //   isSpeakerOn,
  // } = useCall();

  const [callDuration, setCallDuration] = useState(0);
  const pulseAnim = new Animated.Value(1);

  // useEffect(() => {
  //   if (!currentCall) {
  //     makeCall(phoneNumber, contactId);
  //   }
  // }, []);

  // useEffect(() => {
  //   let interval:  ReturnType<typeof setInterval>;
    
  //   if (currentCall?.status === CallStatus.CONNECTED) {
  //     interval = setInterval(() => {
  //       setCallDuration(prev => prev + 1);
  //     }, 1000);
  //   }
    
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [currentCall?.status]);

  // useEffect(() => {
  //   // Pulse animation for connecting state
  //   if (currentCall?.status === CallStatus.CONNECTING) {
  //     const pulse = () => {
  //       Animated.sequence([
  //         Animated.timing(pulseAnim, {
  //           toValue: 1.1,
  //           duration: 1000,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(pulseAnim, {
  //           toValue: 1,
  //           duration: 1000,
  //           useNativeDriver: true,
  //         }),
  //       ]).start(pulse);
  //     };
  //     pulse();
  //   }
  // }, [currentCall?.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // const handleEndCall = async () => {
  //   await endCall();
  //   navigation.goBack();
  // };

  // const getStatusText = () => {
  //   switch (currentCall?.status) {
  //     case CallStatus.CONNECTING:
  //       return 'Connecting...';
  //     case CallStatus.CONNECTED:
  //       return formatDuration(callDuration);
  //     default:
  //       return 'Calling...';
  //   }
  // };

  // const contactName = currentCall?.contact.name || phoneNumber;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[
          styles.avatar,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Text style={styles.avatarText}>
            {/* {contactName.charAt(0).toUpperCase()} */}
          </Text>
        </Animated.View>
        
        {/* <Text style={styles.name}>{contactName}</Text> */}
        {/* //<Text style={styles.status}>{getStatusText()}</Text> */}
        <Text style={styles.phone}>{phoneNumber}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          // style={[styles.actionButton, isMuted && styles.actionButtonActive]}
          // onPress={toggleMute}
        >
          <Text style={styles.actionIcon}>🔇</Text>
          <Text style={styles.actionLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          // style={[styles.actionButton, isSpeakerOn && styles.actionButtonActive]}
          // onPress={toggleSpeaker}
        >
          <Text style={styles.actionIcon}>🔊</Text>
          <Text style={styles.actionLabel}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Keypad')}
        >
          <Text style={styles.actionIcon}>⌨️</Text>
          <Text style={styles.actionLabel}>Keypad</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.endCallButton}
          // onPress={handleEndCall}
        >
          <Text style={styles.endCallIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'space-between',
    paddingVertical: Sizes.xxl,
  },
  header: {
    alignItems: 'center',
    paddingTop: Sizes.xxl,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.xl,
  },
  avatarText: {
    fontSize: 60,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
  },
  name: {
    fontSize: Sizes.fontTitle,
    fontFamily: Fonts.semiBold,
    color: Colors.textWhite,
    marginBottom: Sizes.sm,
  },
  status: {
    fontSize: Sizes.fontMd,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Sizes.xs,
  },
  phone: {
    fontSize: Sizes.fontSm,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Sizes.xl,
  },
  actionButton: {
    alignItems: 'center',
    padding: Sizes.lg,
    borderRadius: Sizes.radiusXl,
    backgroundColor: Colors.backgroundSecondary,
    minWidth: 80,
  },
  actionButtonActive: {
    backgroundColor: Colors.primary,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Sizes.xs,
  },
  actionLabel: {
    fontSize: Sizes.fontSm,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Sizes.xl,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallIcon: {
    fontSize: 30,
    transform: [{ rotate: '135deg' }],
  },
});