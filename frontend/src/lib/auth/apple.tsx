import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';

import { firebaseAuth } from '../config/firebase';

export type AuthProviderService = 'supabase' | 'firebase';
interface AppleLoginButtonProps {
  provider?: AuthProviderService;
}
export function AppleLoginButton({
  provider = 'firebase',
}: AppleLoginButtonProps) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAvailable);
  }, []);

  const loginWithApple = useCallback(async () => {
    // create random values for generating Apple credential token
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      state: csrf,
      nonce: hashedNonce,
    });
    const { identityToken } = appleCredential;

    if (identityToken) {
      switch (provider) {
        case 'supabase':
          // TODO: implement this
          // await supabase.auth.signInWithIdToken({
          //   provider: 'apple',
          //   token: identityToken,
          //   nonce,
          // });
          break;
        case 'firebase': {
          const cred = new OAuthProvider('apple.com').credential({
            idToken: identityToken,
            rawNonce: nonce,
          });
          await signInWithCredential(firebaseAuth, cred);
          break;
        }
      }
    }
  }, [provider]);

  return available ? (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      style={{ width: 200, height: 64 }}
      onPress={loginWithApple}
    />
  ) : null;
}