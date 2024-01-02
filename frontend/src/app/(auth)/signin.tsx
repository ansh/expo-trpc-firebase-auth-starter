import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../../lib/auth/AuthContext';

import { AppleLoginButton } from '@/lib/auth/apple';

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const { sendOTP, renderRecaptcha, isLoading } = useAuth();

  return (
    <View className="h-full">
      <KeyboardAvoidingView className="flex h-full flex-col items-center justify-center">
        <Text className="text-2xl font-medium text-center">
          What's your phone number?
        </Text>

        <View className="flex flex-row justify-center">
          <Text className="text-3xl font-medium pt-6">+1</Text>
          <TextInput
            className="p-2 mt-4 text-3xl"
            placeholder="9197172293"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phoneNumber}
            onChangeText={(number) => setPhoneNumber(number)}
            autoFocus
          />
        </View>

        <Text>Login with Firebase</Text>
        <AppleLoginButton provider="firebase" />
        <Text>Login with Supabase</Text>
        <AppleLoginButton provider="supabase" />

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="Get OTP"
            onPress={() => {
              if (!phoneNumber) return;
              // Get OTP here and navigate to the next screen
              sendOTP(phoneNumber).then(() => {
                router.push('/verifyotp');
              });
            }}
            disabled={!phoneNumber || phoneNumber.length < 10}
          />
        )}
        {renderRecaptcha()}
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
