import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../lib/auth/AuthContext';

const VerifyOTP = () => {
  const { verifyOTP, isLoading } = useAuth();
  const [otpCode, setOtpCode] = useState<string>();

  return (
    <View className="h-full">
      <KeyboardAvoidingView className="flex h-full flex-col items-center justify-center">
        <Text className="text-2xl font-medium text-center">Verify OTP</Text>

        <TextInput
          className="p-2 mt-4 text-3xl text-center"
          placeholder="123456"
          keyboardType="phone-pad"
          autoComplete="one-time-code"
          onChangeText={(number) => setOtpCode(number)}
          maxLength={6}
          autoFocus
        />

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="Verify OTP"
            onPress={async () => {
              if (!otpCode) return;
              await verifyOTP(otpCode);
              Toast.show({
                type: 'success',
                text1: 'OTP Verified',
                text2: `OTP code ${otpCode} has been verified.`,
              });
            }}
            disabled={!otpCode || otpCode.length < 6}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyOTP;
