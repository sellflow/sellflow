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
import { ShopifyProvider } from "@shopify/hydrogen-react";
import { CartProvider } from "@/components/CartProvider";
import { Image } from "expo-image";

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
          <Stack
            screenOptions={{
              animation: "slide_from_right",
              headerBackButtonDisplayMode: "minimal",
            }}
          >
            <Stack.Screen
              name="order/[id]"
              options={{ headerTitle: "Order" }}
            />
            <Stack.Screen
              name="product/[id]"
              options={{ headerTitle: "Product" }}
            />
            <Stack.Screen name="account" options={{ headerTitle: "Account" }} />
            <Stack.Screen name="orders" options={{ headerTitle: "Orders" }} />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerLeft: () => (
                  <Image
                    source={require("@/images/favicon.svg")}
                    style={{ width: 35, height: 35, borderRadius: 100 }}
                  />
                ),
                headerTitle: "",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </ShopifyProvider>
    </ThemeProvider>
  );
}
