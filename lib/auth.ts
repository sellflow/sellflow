import {
  AuthRequest,
  AuthSessionResult,
  exchangeCodeAsync,
  refreshAsync,
} from "expo-auth-session";
import { storage } from "./storage";

interface LoginUserProps {
  request: AuthRequest | null;
  promptAsync: () => Promise<AuthSessionResult>;
  redirectUri: string;
  setLoginComplete: (arg0: boolean) => void;
}

export const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_ENDPOINT}/oauth/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_ENDPOINT}/oauth/token`,
  revocationEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_ENDPOINT}/logout`,
};

export const loginUser = ({
  request,
  promptAsync,
  redirectUri,
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
        // Securely store the auth on your device
        storage.set("idToken", res.idToken!);
        storage.set("accessToken", res.accessToken);
        storage.set("refreshToken", res.refreshToken!);
        setLoginComplete(true);
      });
    }
  });
};

export const refreshUser = async () => {
  const refreshToken = storage.getString("refreshToken");
  if (!refreshToken) {
    return;
  }
  refreshAsync(
    {
      clientId: process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN!,
      refreshToken: refreshToken,
    },
    discovery,
  ).then((res) => {
    storage.set("accessToken", res.accessToken);
    storage.set("refreshToken", res.refreshToken!);
  });
};
