import * as Notifications from "expo-notifications";
import { useCart } from "@/components/shopify/CartProvider";
import LineItem from "@/components/LineItem";
import shopifyCheckout from "@/shopify/checkout";
import { Trans, useLingui } from "@lingui/react/macro";
import { CartLineProvider } from "@shopify/hydrogen-react";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";

export default function Cart() {
  const cart = useCart();
  const { i18n, t } = useLingui();
  const [note, setNote] = useState(cart?.note || "");

  const handleNoteSubmit = () => {
    try {
      cart.noteUpdate(note);

      Toast.show({
        type: "success",
        text1: "Successfully saved note",
        position: "bottom",
        bottomOffset: 60,
      });
    } catch (e) {
      console.error(`Failed to save note ${e}`);
      Toast.show({
        type: "error",
        text1: "Failed to save note",
        position: "bottom",
        bottomOffset: 60,
      });
    }
  };

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
        <ScrollView style={[styles.ScrollContainer]}>
          <View style={styles.Container}>
            <Text style={[styles.Subtotal]}>
              <Trans>
                Subtotal:{" "}
                <Text style={{ fontWeight: 600 }}>
                  {cart?.cost?.subtotalAmount &&
                    i18n.number(Number(cart.cost?.subtotalAmount?.amount), {
                      style: "currency",
                      currency: cart.cost?.subtotalAmount?.currencyCode,
                    })}
                </Text>
              </Trans>
            </Text>
            <View style={styles.NoteContainer}>
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={500}
                returnKeyType="done"
                placeholder="Leave a note..."
                style={[styles.Note]}
                onSubmitEditing={handleNoteSubmit}
              />
            </View>
            <TouchableOpacity
              onPress={handleCheckout}
              style={[styles.Checkout]}
            >
              <Text style={styles.CheckoutText}>
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
        <ScrollView style={[styles.ScrollContainer]}>
          <View style={styles.Container}>
            <Text style={[styles.Subtotal]}>
              <Trans>
                Subtotal:{" "}
                <Text style={{ fontWeight: 600 }}>
                  {cart.cost?.subtotalAmount
                    ? i18n.number(Number(cart.cost?.subtotalAmount?.amount), {
                        style: "currency",
                        currency: cart.cost?.subtotalAmount?.currencyCode,
                      })
                    : ""}
                </Text>
              </Trans>
            </Text>
            <View style={styles.NoteContainer}>
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={500}
                returnKeyType="done"
                placeholder="Leave a note..."
                style={[styles.Note]}
                onSubmitEditing={handleNoteSubmit}
              />
            </View>
            <View style={styles.Checkout}>
              <Text style={styles.CheckoutText}>
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

const styles = StyleSheet.create((theme) => ({
  ScrollContainer: {
    width: "100%",
    backgroundColor: theme.colors.background,
  },
  Container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 8,
  },
  Subtotal: {
    fontSize: 20,
    color: theme.colors.text,
  },
  NoteContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    width: "100%",
  },
  Note: {
    fontSize: 16,
    color: theme.colors.text,
  },
  LineItemContainer: {
    width: "100%",
    marginBottom: 8,
  },
  ListStyle: {
    width: "100%",
    paddingVertical: 32,
  },
  Checkout: {
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 4,
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.text,
  },
  CheckoutText: {
    color: theme.colors.background,
  },
}));
