import * as Notifications from "expo-notifications";
import { useCart } from "@/components/shopify/CartProvider";
import LineItem from "@/components/LineItem";
import { Colors } from "@/constants/Colors";
import shopifyCheckout from "@/shopify/checkout";
import { Trans, useLingui } from "@lingui/react/macro";
import { CartLineProvider } from "@shopify/hydrogen-react";
import { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  FlatList,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function Cart() {
  const cart = useCart();
  const { i18n } = useLingui();
  const colorScheme = useColorScheme();
  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  if (Platform.OS === "android" || Platform.OS === "ios") {
    const handleCheckout = () => {
      if (cart.checkoutUrl) {
        shopifyCheckout!.present(cart.checkoutUrl);
      }
    };

    useEffect(() => {
      if (cart.checkoutUrl) shopifyCheckout!.preload(cart.checkoutUrl);
      shopifyCheckout?.addEventListener("completed", async () => {
        try {
          Notifications.cancelAllScheduledNotificationsAsync();
          console.log("All pending notifications have been cancelled");
        } catch (e) {
          console.log("Failed to cancel notificaitons");
        }
      });
      shopifyCheckout?.addEventListener("close", async () => {
        try {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Sellflow",
              body: "Last chance to grab this!",
              data: { url: "com.sellflow://cart" },
            },
            trigger: {
              seconds: 60 * 60 * 3,
              repeats: true,
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            },
          });
        } catch (e) {
          console.error(`Failed to schedule cart checkout notification: ${e}`);
        }
      });
    }, []);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
          <View style={styles.Container}>
            <Text style={[styles.Subtotal, { color: textColor }]}>
              <Trans>
                Subtotal:{" "}
                <Text style={{ fontWeight: 600 }}>
                  {i18n.number(Number(cart.cost?.subtotalAmount?.amount), {
                    style: "currency",
                    currency: cart.cost?.subtotalAmount?.currencyCode,
                  })}
                </Text>
              </Trans>
            </Text>
            <TouchableOpacity
              onPress={handleCheckout}
              style={[
                styles.Checkout,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.dark.background
                      : Colors.light.background,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    colorScheme === "light"
                      ? Colors.dark.text
                      : Colors.light.text,
                }}
              >
                <Trans>Proceed to Checkout</Trans>
              </Text>
            </TouchableOpacity>
            {cart?.lines ? (
              <View style={styles.ListStyle}>
                {cart?.lines.map((line: any, index: number) => (
                  <CartLineProvider line={line} key={index}>
                    <View style={styles.LineItemContainer}>
                      <LineItem />
                    </View>
                  </CartLineProvider>
                ))}
              </View>
            ) : (
              <Text>
                <Trans>No items in here yet!</Trans>
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
          <View style={styles.Container}>
            <View
              style={{
                backgroundColor:
                  colorScheme === "light"
                    ? Colors.dark.background
                    : Colors.light.background,
                ...styles.Checkout,
              }}
            >
              <Text
                style={{
                  color:
                    colorScheme === "light"
                      ? Colors.dark.text
                      : Colors.light.text,
                }}
              >
                <Trans>Proceed to Checkout</Trans>
              </Text>
            </View>
            {cart?.lines ? (
              <View style={styles.ListStyle}>
                {cart?.lines.map((line: any, index: number) => (
                  <CartLineProvider line={line} key={index}>
                    <View style={styles.LineItemContainer}>
                      <LineItem />
                    </View>
                  </CartLineProvider>
                ))}
              </View>
            ) : (
              <Text>
                <Trans>No items in here yet!</Trans>
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ScrollContainer: {
    width: "100%",
  },
  Container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 8,
  },
  Subtotal: {
    fontSize: 20,
  },
  LineItemContainer: {
    width: "100%",
    marginBottom: 8,
  },
  ListStyle: {
    width: "100%",
  },
  Checkout: {
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
    marginBottom: 4,
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
