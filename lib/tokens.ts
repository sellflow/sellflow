import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const SECURE_AUTH_STATE_KEY = process.env.EXPO_PUBLIC_AUTH_STATE_KEY!;
export const SECURE_AUTH_REFRESH_KEY =
  process.env.EXPO_PUBLIC_AUTH_REFRESH_KEY!;

export const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_API_ENDPOINT}/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_API_ENDPOINT}/token`,
  revocationEndpoint: `${process.env.EXPO_PUBLIC_CUSTOMER_API_ENDPOINT}/logout`,
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
