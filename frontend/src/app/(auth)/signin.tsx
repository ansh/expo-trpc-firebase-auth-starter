import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/lib/auth/AuthContext';
import { AppleLoginButton } from '@/lib/auth/apple';
import { GoogleLoginButton } from '@/lib/auth/google';

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const { sendOTP, renderRecaptcha, isLoading } = useAuth();

  return (
    <ScrollView className="h-full">
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

        <Text>Login with Firebase</Text>
        <AppleLoginButton provider="firebase" />
        <GoogleLoginButton provider="firebase" />
        <Text>Login with Supabase</Text>
        <AppleLoginButton provider="supabase" />
        <GoogleLoginButton provider="supabase" />

        {renderRecaptcha()}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignIn;
