import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "user",
  encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || "key",
});
