import {
  AuthRequest,
  AuthSessionResult,
  exchangeCodeAsync,
  refreshAsync,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  getRefreshToken,
  SECURE_AUTH_REFRESH_KEY,
  SECURE_AUTH_STATE_KEY,
} from "./tokens";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Discovery {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  revocationEndpoint: string;
}

interface LoginUserProps {
  request: AuthRequest | null;
  promptAsync: () => Promise<AuthSessionResult>;
  redirectUri: string;
  discovery: Discovery;
  setLoginComplete: (arg0: boolean) => void;
}

export const loginUser = ({
  request,
  promptAsync,
  redirectUri,
  discovery,
  setLoginComplete,
}: LoginUserProps) => {
  promptAsync().then((codeResponse) => {
    if (request && codeResponse.type === "success") {
      exchangeCodeAsync(
        {
          clientId: process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN!,
          code: codeResponse.params.code,
          extraParams: request.codeVerifier
            ? { code_verifier: request.codeVerifier }
            : undefined,
          redirectUri,
        },
        discovery,
      ).then((res) => {
        if (Platform.OS !== "web") {
          // Securely store the auth on your device
          SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, res.accessToken);
          SecureStore.setItemAsync(SECURE_AUTH_REFRESH_KEY, res.refreshToken!);
          setLoginComplete(true);
        } else {
          // Not secure but it works ¯\_(ツ)_/¯
          AsyncStorage.setItem(SECURE_AUTH_STATE_KEY, res.accessToken);
          AsyncStorage.setItem(SECURE_AUTH_REFRESH_KEY, res.refreshToken!);
          setLoginComplete(true);
        }
      });
    }
  });
};

interface RefreshUserProps {
  discovery: Discovery;
}

export const refreshUser = async ({ discovery }: RefreshUserProps) => {
  refreshAsync(
    {
      clientId: process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN!,
      refreshToken: await getRefreshToken()!,
    },
    discovery,
  ).then((res) => {
    if (Platform.OS !== "web") {
      // Securely store the auth on your device
      SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, res.accessToken);
      SecureStore.setItemAsync(SECURE_AUTH_REFRESH_KEY, res.refreshToken!);
    } else {
      // Not secure but it works ¯\_(ツ)_/¯
      AsyncStorage.setItem(SECURE_AUTH_STATE_KEY, res.accessToken);
      AsyncStorage.setItem(SECURE_AUTH_REFRESH_KEY, res.refreshToken!);
    }
  });
};
