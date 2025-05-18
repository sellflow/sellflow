import { Platform } from "react-native";
import type { ShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import { darkTheme, lightTheme } from "@/styles/unistyles";

let shopifyCheckout: ShopifyCheckoutSheet | undefined;
if (Platform.OS === "android" || Platform.OS === "ios") {
  const { ShopifyCheckoutSheet } = require("@shopify/checkout-sheet-kit");
  shopifyCheckout = new ShopifyCheckoutSheet(
    {
      preloading: true,
      title: "Sellflow",
      colors: {
        ios: {
          backgroundColor: lightTheme.colors.background,
          tintColor: lightTheme.colors.tint,
        },
        android: {
          light: {
            backgroundColor: lightTheme.colors.background,
            progressIndicator: lightTheme.colors.icon,
            headerBackgroundColor: lightTheme.colors.background,
            headerTextColor: lightTheme.colors.text,
          },
          dark: {
            backgroundColor: darkTheme.colors.background,
            progressIndicator: darkTheme.colors.icon,
            headerBackgroundColor: darkTheme.colors.background,
            headerTextColor: darkTheme.colors.text,
          },
        },
      },
    },
    {
      handleGeolocationRequests: true,
    },
  );
}

export default shopifyCheckout;
