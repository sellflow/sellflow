import "@formatjs/intl-locale/polyfill-force";

import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/en"; // locale-data for en
import "@formatjs/intl-pluralrules/locale-data/es"; // locale-data for es

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState, ReactNode } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { ShopifyProvider } from "@shopify/hydrogen-react";
import { CartProvider } from "@/components/shopify/CartProvider";
import Header from "@/components/Header";
import {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen-react/storefront-api-types";
import { getLocales } from "expo-localization";
import { I18nProvider, TransRenderProps } from "@lingui/react";
import { messages as esMessages } from "@/locales/es/messages";
import { messages as enMessages } from "@/locales/en/messages";
import { i18n } from "@lingui/core";
import { Text } from "react-native";
import { t } from "@lingui/core/macro";

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

export default function RootLayout() {
  const [user, setUser] = useState("");
  const [countryIsoCode, setCountryIsoCode] = useState<CountryCode>(
    countryCode.toUpperCase() as CountryCode,
  );
  const [languageIsoCode, setLanguageIsoCode] = useState<LanguageCode>(
    languageCode.toUpperCase() as LanguageCode,
  );
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
    <I18nProvider i18n={i18n} defaultComponent={DefaultComponent}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ShopifyProvider
          storeDomain={process.env.EXPO_PUBLIC_STORE_DOMAIN!}
          storefrontApiVersion="2025-01"
          storefrontToken={process.env.EXPO_PUBLIC_STORE_TOKEN!}
          countryIsoCode={countryIsoCode}
          languageIsoCode={languageIsoCode}
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
          </CartProvider>
        </ShopifyProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
