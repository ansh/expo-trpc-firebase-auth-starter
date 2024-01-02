import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AuthProviderService } from './apple';
import { firebaseAuth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, fullResult, attemptGoogleSignIn] = Google.useIdTokenAuthRequest({
    androidClientId:
      '665412012590-uov3i6elqe15q3uc8ud0d2588ve9scua.apps.googleusercontent.com',
    expoClientId:
      '665412012590-770cofm2lb9akcb280toq593brl8amrm.apps.googleusercontent.com',
    selectAccount: true,
    scopes: ['profile', 'email', 'openid'],
  });

  // TODO: Figure out if this is required
  // useEffect(() => {
  //   const start = async () => {
  //     if (fullResult?.type === 'success') {
  //       if (fullResult.authentication?.idToken) {
  //         await signInWithCredential(
  //           firebaseAuth,
  //           GoogleAuthProvider.credential(fullResult.authentication?.idToken)
  //         );
  //       }
  //     }
  //   };
  //   start();
  // }, [fullResult]);

  const loginWithGoogle = async (
    provider: AuthProviderService = 'firebase'
  ) => {
    try {
      setIsLoading(true);
      const response = await attemptGoogleSignIn();
      if (response.type === 'success') {
        switch (provider) {
          case 'firebase':
            await signInWithCredential(
              firebaseAuth,
              GoogleAuthProvider.credential(response.params?.id_token)
            );
            break;
          case 'supabase':
            // TODO: Implement Supabase Google Auth
            // const {
            //   data: { session },
            // } = await supabase.auth.signInWithIdToken({
            //   provider: 'google',
            //   token: response.params.id_token,
            // });
            // if (session) {
            //   await supabase.auth.setSession({ ...session });
            // }
            break;
        }
      }
    } catch (err: any) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithGoogle,
    isLoading,
  };
};

export const GoogleLoginButton = ({
  provider,
}: {
  provider: AuthProviderService;
}) => {
  const { isLoading, loginWithGoogle } = useGoogleAuth();

  // TODO: implement an actual design here for google login
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Login with Google"
          onPress={() => {
            loginWithGoogle(provider);
          }}
        />
      )}
    </View>
  );
};
