import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, Button } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/lib/auth/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  return (
    <View className="items-center flex-1 justify-center">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text className="text-xl font-bold">Profile</Text>
      <View className="h-[1px] my-7 w-4/5 bg-gray-200" />
      <Text>
        Signed in as: {user?.phoneNumber} {user?.id}
      </Text>
      <Button
        title="Sign out"
        onPress={() => {
          signOut().then(() => {
            Toast.show({
              type: 'success',
              text1: 'Signed out successfully',
            });
          });
        }}
      />
    </View>
  );
}
