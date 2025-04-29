import "@formatjs/intl-locale/polyfill-force";

import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/en"; // locale-data for en
import "@formatjs/intl-pluralrules/locale-data/es"; // locale-data for es

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, useColorScheme } from "react-native";
import { ShopifyProvider } from "@shopify/hydrogen-react";
import { CartProvider } from "@/components/shopify/CartProvider";
import * as Notifications from "expo-notifications";
import Header from "@/components/Header";
import {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen-react/storefront-api-types";
import { getLocales } from "expo-localization";
import { I18nProvider, TransRenderProps } from "@lingui/react";
import { messages as esMessages } from "@/locales/es/messages";
import { messages as enMessages } from "@/locales/en/messages";
import BottomSheetProvider from "@/components/BottomSheetProvider";
import Toast from "react-native-toast-message";
import { i18n } from "@lingui/core";
import { Text } from "react-native";
import { t } from "@lingui/core/macro";
import { useMMKVString } from "react-native-mmkv";
import { refreshUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

const locales = getLocales();
let languageCode = locales[0]?.languageCode || "en";
let countryCode = locales[0]?.regionCode || "US";

i18n.load({
  en: enMessages,
  es: esMessages,
});
i18n.activate(languageCode);

const DefaultComponent = (props: TransRenderProps) => (
  <Text>{props.children}</Text>
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function useNotificationObserver() {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    useEffect(() => {
      let isMounted = true;

      function redirect(notification: Notifications.Notification) {
        const url = notification.request.content.data?.url;
        if (url) {
          router.push(url);
        }
      }

      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          redirect(response.notification);
        });

      return () => {
        isMounted = false;
        subscription.remove();
      };
    }, []);
  }
}

const queryClient = new QueryClient();

export default function RootLayout() {
  useNotificationObserver();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [countryIsoCode, setCountryIsoCode] = useState<CountryCode>(
    countryCode.toUpperCase() as CountryCode,
  );
  const [languageIsoCode, setLanguageIsoCode] = useState<LanguageCode>(
    languageCode.toUpperCase() as LanguageCode,
  );
  const colorScheme = useColorScheme();

  const onSuccessAddToCart = () => {
    Toast.show({
      type: "success",
      text1: "Product added to cart",
      position: "bottom",
      bottomOffset: 60,
    });
  };

  const onSuccessRemoveFromCart = () => {
    Toast.show({
      type: "success",
      text1: "Product successfully removed from cart",
      position: "bottom",
      bottomOffset: 60,
    });
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <I18nProvider i18n={i18n} defaultComponent={DefaultComponent}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <ShopifyProvider
              storeDomain={process.env.EXPO_PUBLIC_STORE_DOMAIN!}
              storefrontApiVersion="2025-01"
              storefrontToken={process.env.EXPO_PUBLIC_STORE_TOKEN!}
              countryIsoCode={countryIsoCode}
              languageIsoCode={languageIsoCode}
            >
              <CartProvider
                onLineAddComplete={onSuccessAddToCart}
                onLineRemoveComplete={onSuccessRemoveFromCart}
                customerAccessToken={accessToken}
              >
                <BottomSheetProvider>
                  <Stack
                    screenOptions={{
                      animation: "slide_from_right",
                      headerBackButtonDisplayMode: "minimal",
                    }}
                  >
                    <Stack.Screen
                      name="order/[id]"
                      options={{ headerTitle: t`Order` }}
                    />
                    <Stack.Screen
                      name="product/[id]"
                      options={{ headerTitle: t`Product` }}
                    />
                    <Stack.Screen
                      name="account"
                      options={{ headerTitle: t`Account` }}
                    />
                    <Stack.Screen
                      name="orders"
                      options={{ headerTitle: t`Orders` }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{
                        header: () => <Header />,
                        headerTitle: "",
                      }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </BottomSheetProvider>
              </CartProvider>
            </ShopifyProvider>
          </ThemeProvider>
        </I18nProvider>
      </QueryClientProvider>
      <Toast />
    </>
  );
}
