import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = () => {
  return (
    <SafeAreaView className="px-4">
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;
