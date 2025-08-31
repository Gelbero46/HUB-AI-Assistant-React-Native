import { Button, Header, Input } from '@/components';
import OnboardingScreenStyle from '@/constants/styles/OnboardingScreenStyle';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
// import { useTheme } from '@react-navigation/native';
import { useTheme } from '@/context/theme-context';
import { useAuth } from '@clerk/clerk-expo';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

const OnboardingScreen: React.FC = () => {
  const { isSignedIn } = useAuth()
  const router = useRouter();
  const {user} = useUser();
  console.log("user", user)
  useEffect(() => {
    if (isSignedIn && user?.unsafeMetadata?.businessName) {
      router.replace('/protected/main' as never);
    }
  }, [isSignedIn, router]);

 
  // console.log("user in onboarding", user)
  const {colors: Colors, fonts: Fonts, sizes: Sizes, theme} = useTheme()
  //  const {theme, toggleTheme} = _useTheme()
   console.log("theme", theme)
  const styles = useMemo( () => 
    OnboardingScreenStyle({Colors, Fonts, Sizes}),
  [theme]
)
  

 
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    phoneNumber: '',
  })
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // const { updateUser, user } = useAuthStore();

  const updateBusinessData = (key: string, value: string) => {
    setBusinessData(prev => ({ ...prev, [key]: value }));
  };

  const businessTypes = [
    'Consulting',
    'Real Estate',
    'Healthcare',
    'Legal Services',
    'Sales',
    'Marketing',
    'Finance',
    'Other',
  ];

  const steps = [
    {
      title: 'Welcome to HUB!',
      subtitle: 'Let\'s set up your business profile to personalize your AI assistant.',
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>
            M1 will help you manage your business communications more efficiently by:
          </Text>
          <View style={styles.featuresList}>
            <Text style={styles.feature}>📞 Recording and summarizing calls</Text>
            <Text style={styles.feature}>✅ Extracting action items automatically</Text>
            <Text style={styles.feature}>🤖 Providing AI-powered insights</Text>
            <Text style={styles.feature}>📋 Managing your tasks and follow-ups</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Business Information',
      subtitle: 'Tell us about your business so M1 can provide better assistance.',
      content: (
        <View style={styles.formContent}>
          <Input
            label="Business Name"
            value={businessData.businessName}
            onChangeText={(value) => updateBusinessData('businessName', value)}
            placeholder="Enter your business name"
          />
          
          <Input
            label="Business Phone Number"
            value={businessData.phoneNumber}
            onChangeText={(value) => updateBusinessData('phoneNumber', value)}
            placeholder="Enter your business phone"
            keyboardType="phone-pad"
          />

          <Input
            label="Business Description (Optional)"
            value={businessData.description}
            onChangeText={(value) => updateBusinessData('description', value)}
            placeholder="Briefly describe what your business does"
          />
        </View>
      ),
    },
    {
      title: 'You\'re All Set!',
      subtitle: 'M1 is ready to be your AI-powered business assistant.',
      content: (
        <View style={styles.completionContent}>
          <Text style={styles.completionText}>
            Your M1 assistant is now configured and ready to help you with:
          </Text>
          <View style={styles.featuresList}>
            <Text style={styles.feature}>🎯 Smart call management</Text>
            <Text style={styles.feature}>📝 Automated note-taking</Text>
            <Text style={styles.feature}>🔍 Intelligent search</Text>
            <Text style={styles.feature}>⚡ Task automation</Text>
          </View>
          <Text style={styles.completionSubtext}>
            Start making calls or explore the app to see M1 in action!
          </Text>
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Update user with business information
      await user?.update({
        unsafeMetadata:{
          businessName: businessData.businessName,
          description: businessData.description,
          phoneNumber: businessData.phoneNumber,
        }
      })
      console.log("Business data to update", businessData)
      setIsLoading(false);

      router.replace('/protected/main' as never);
    
      
    } catch (error) {
      console.log('Error updating user:', error);
      Alert.alert('Error', "Couldn't update user");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return businessData.businessName.trim() && businessData.phoneNumber.trim();
    }
    return true;
  };

  const currentStepData = steps[currentStep];

  return (
     <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >   
      <Header title={`Step ${currentStep + 1} of ${steps.length}`} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
        </View>

        <View style={styles.stepContent}>
          {currentStepData.content}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          {currentStep > 0 && (
            <Button
              title="Back"
              onPress={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              style={styles.backButton}
            />
          )}
          
          <Button
            title={currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            disabled={!canProceed()}
            isLoading={isLoading}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default OnboardingScreen;
