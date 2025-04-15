import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import type { ShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";

let shopifyCheckout: ShopifyCheckoutSheet | undefined;
if (Platform.OS === "android" || Platform.OS === "ios") {
  const { ShopifyCheckoutSheet } = require("@shopify/checkout-sheet-kit");
  shopifyCheckout = new ShopifyCheckoutSheet(
    {
      preloading: true,
      title: "Sellflow",
      colors: {
        ios: {
          backgroundColor: Colors.light.background,
          tintColor: Colors.light.tint,
        },
        android: {
          light: {
            backgroundColor: Colors.light.background,
            progressIndicator: Colors.light.icon,
            headerBackgroundColor: Colors.light.background,
            headerTextColor: Colors.light.text,
          },
          dark: {
            backgroundColor: Colors.dark.background,
            progressIndicator: Colors.dark.icon,
            headerBackgroundColor: Colors.dark.background,
            headerTextColor: Colors.dark.text,
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
