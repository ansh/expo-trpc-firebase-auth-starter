import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, Button } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRevenueCat } from '@/lib/config/revenuecat';
import ProductsList from '@/lib/iap/ProductsList';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { packages } = useRevenueCat();

  return (
    <View className="items-center flex-1 justify-center">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text className="text-xl font-bold">Profile</Text>

      <View className="h-[1px] my-7 w-4/5 bg-gray-200" />

      <Text>Phone Number: {user?.phoneNumber}</Text>
      <Text>User ID: {user?.id}</Text>
      <Text>Is Pro Subscription: {user?.isPro ? 'TRUE' : 'FALSE'}</Text>
      <ProductsList />

      <View className="h-[1px] my-7 w-4/5 bg-gray-200" />

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
