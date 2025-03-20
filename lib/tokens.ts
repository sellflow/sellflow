import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const SECURE_AUTH_STATE_KEY = process.env.EXPO_PUBLIC_AUTH_STATE_KEY!;
export const SECURE_AUTH_REFRESH_KEY =
  process.env.EXPO_PUBLIC_AUTH_REFRESH_KEY!;

export const discovery = {
  authorizationEndpoint:
    "https://shopify.com/authentication/72278704345/oauth/authorize",
  tokenEndpoint: "https://shopify.com/authentication/72278704345/oauth/token",
  revocationEndpoint: "https://shopify.com/authentication/72278704345/logout",
};

export const getAccessToken = async () => {
  if (Platform.OS === "web") {
    return await AsyncStorage.getItem(SECURE_AUTH_STATE_KEY);
  } else {
    return await SecureStore.getItemAsync(SECURE_AUTH_STATE_KEY);
  }
};

export const getRefreshToken = async (): Promise<string> => {
  let token = await AsyncStorage.getItem(SECURE_AUTH_REFRESH_KEY);

  return token ?? "";
};
