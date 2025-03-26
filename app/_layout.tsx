import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState("");
  const colorScheme = useColorScheme();

  const getUser = () => {
    if (typeof window !== "undefined") {
      const { getAccessToken } = require("@/lib/tokens");
      return getAccessToken().then((res: string) => setUser(res));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ShopifyProvider
        storeDomain={process.env.EXPO_PUBLIC_STORE_DOMAIN!}
        storefrontApiVersion="2025-01"
        storefrontToken={process.env.EXPO_PUBLIC_STORE_TOKEN!}
        countryIsoCode="US"
        languageIsoCode="EN"
      >
        <CartProvider
          onLineAdd={() => console.log("A line is being added")}
          onLineAddComplete={() => console.log("Line add complete")}
          customerAccessToken={user}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </ShopifyProvider>
    </ThemeProvider>
  );
}
