import React from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from 'react-native-purchases';
import Toast from 'react-native-toast-message';

import { useAuth } from '../auth/AuthContext';

const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const REVENUECAT_ANDROID_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

type RevenueCatProviderProps = {
  purchasePackage: (pack: PurchasesPackage) => void;
  restorePurchases: () => void;
  packages: PurchasesPackage[];
};

const RevenueCatContext = React.createContext<RevenueCatProviderProps>({
  purchasePackage: () => {},
  restorePurchases: () => {},
  packages: [],
});

export const useRevenueCat = () => {
  const value = React.useContext(RevenueCatContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error(
        'useRevenueCat must be wrapped in a <RevenueCatProvider />'
      );
    }
  }
  return value;
};

const RevenueCatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isProTier, setIsProTier] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [packages, setPackages] = React.useState<PurchasesPackage[]>([]);
  const { user } = useAuth();

  React.useEffect(() => {
    async function setup() {
      if (Platform.OS === 'ios' && REVENUECAT_IOS_API_KEY) {
        Purchases.configure({
          apiKey: REVENUECAT_IOS_API_KEY,
          appUserID: user ? user.id : null,
        });
      } else if (Platform.OS === 'android' && REVENUECAT_ANDROID_API_KEY) {
        Purchases.configure({
          apiKey: REVENUECAT_ANDROID_API_KEY,
          appUserID: user ? user.id : null,
        });
      }
      setIsReady(true);

      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      await loadOfferings();

      Purchases.addCustomerInfoUpdateListener((info) => {
        updateCustomerInfo(info);
      });
    }

    setup();
  }, [user]);

  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    console.log('offerings', offerings);
    if (offerings.current) {
      setPackages(offerings.current.availablePackages);
    }
  };

  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      const res = await Purchases.purchasePackage(pack);
      console.log('purchasedPackage', res);
      if (pack.identifier === '$rc_monthly') {
        setIsProTier(true);
      }
    } catch (error) {
      console.error('purchasePackage', error);
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      }
    }
  };

  const restorePurchases = async () => {};

  const updateCustomerInfo = async (info: CustomerInfo) => {
    console.log('info', info.activeSubscriptions);
  };

  return (
    <RevenueCatContext.Provider
      value={{
        purchasePackage,
        restorePurchases,
        packages,
      }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export default RevenueCatProvider;
