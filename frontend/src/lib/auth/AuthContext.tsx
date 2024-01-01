import { router } from 'expo-router';
import {
  PhoneAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import React from 'react';
import Toast from 'react-native-toast-message';

import FirebaseRecaptchaBanner from './firebase-recaptcha/banner';
import { FirebaseRecaptchaVerifierModal } from './firebase-recaptcha/modal';
import { trpc, User } from '../config/api';
import firebaseApp, { firebaseAuth } from '../config/firebase';

const AuthContext = React.createContext<{
  sendOTP: (phoneNumber: string) => Promise<string | undefined>;
  verifyOTP: (verificationCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  isLoading?: boolean;
  renderRecaptcha: () => JSX.Element;
  renderRecaptchaBanner: () => JSX.Element;
  isOTPSent: boolean;
}>({
  sendOTP: () => Promise.resolve(undefined),
  verifyOTP: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  isLoading: undefined,
  user: null,
  renderRecaptcha: () => <></>,
  renderRecaptchaBanner: () => <></>,
  isOTPSent: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAuth must be wrapped in a <AuthProvider />');
    }
  }

  return value;
}

export function AuthProvider(props: React.PropsWithChildren) {
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isOTPSent, setIsOTPSent] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  // Listen for authentication state to change
  React.useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(firebaseAuth, async (userData) => {
      if (userData) {
        const userDataFromDb = await trpc.user.getCurrentUser.query();
        setUser({
          id: userData.uid,
          phoneNumber: userData.phoneNumber!,
          onboardingCompleted: userDataFromDb.onboardingCompleted,
          name: userDataFromDb.name,
        });
      }
      setIsLoading(false);
    });
  }, []);

  const sendOTP = React.useCallback(
    async (phoneNumber: string) => {
      if (!phoneNumber || !recaptchaVerifier.current) return;
      try {
        setIsLoading(true);
        const phoneProvider = new PhoneAuthProvider(firebaseAuth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          '+1' + phoneNumber,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: `Verification code has been sent to your phone.`,
        });
        setIsOTPSent(true);
        return verificationId;
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.message,
        });
        return Promise.reject(err);
      } finally {
        setIsLoading(false);
      }
    },
    [recaptchaVerifier]
  );

  const verifyOTP = React.useCallback(
    async (verificationCode: string) => {
      try {
        setIsLoading(true);
        if (!verificationId || !verificationCode) {
          throw new Error('Verification ID or code is missing');
        }
        const credential = PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        const cred = await signInWithCredential(firebaseAuth, credential);
        const firebaseUser = cred.user;
        const createNewUserIfRequired =
          await trpc.user.createNewUserIfRequired.mutate();
        if (createNewUserIfRequired.isNew) {
          router.replace('/'); // TODO: onboarding here
        } else {
          router.replace('/');
        }
        setUser({
          id: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber!, // we know phone number exists, because that is the only auth method right now
          onboardingCompleted: createNewUserIfRequired.data.onboardingCompleted,
          name: createNewUserIfRequired.data.name,
        });
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: `You're all logged in! 👍`,
        });
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [verificationId]
  );

  const renderRecaptcha = React.useCallback(() => {
    return (
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseApp.options}
        attemptInvisibleVerification
      />
    );
  }, [recaptchaVerifier]);

  const renderRecaptchaBanner = React.useCallback(() => {
    return <FirebaseRecaptchaBanner />;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sendOTP,
        verifyOTP,
        signOut: async () => {
          setUser(null);
          await firebaseAuth.signOut();
        },
        renderRecaptcha,
        renderRecaptchaBanner,
        user,
        isLoading,
        isOTPSent,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
