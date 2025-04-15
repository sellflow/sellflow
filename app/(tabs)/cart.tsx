import { useCart } from "@/components/CartProvider";
import LineItem from "@/components/LineItem";
import { Colors } from "@/constants/Colors";
import shopifyCheckout from "@/shopify/checkout";
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
} from "react-native";

export default function Cart() {
  const cart = useCart();
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
    }, []);

    return (
      <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
        <View style={styles.Container}>
          <Text style={{ color: textColor }}>Your cart</Text>
          {Platform.OS === "ios" || Platform.OS === "android" ? (
            <TouchableOpacity onPress={handleCheckout}>
              <Text>Proceed to Checkout</Text>
            </TouchableOpacity>
          ) : (
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
                Proceed to Checkout
              </Text>
            </View>
          )}
          {
            <FlatList
              data={cart.lines}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <CartLineProvider line={item}>
                  <View style={styles.LineItemContainer}>
                    <LineItem />
                  </View>
                </CartLineProvider>
              )}
              keyExtractor={(line) => line!.id!}
              style={styles.ListStyle}
            />
          }
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
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
                colorScheme === "light" ? Colors.dark.text : Colors.light.text,
            }}
          >
            Proceed to Checkout
          </Text>
        </View>
        <FlatList
          data={cart.lines}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <CartLineProvider line={item}>
              <View style={styles.LineItemContainer}>
                <LineItem />
              </View>
            </CartLineProvider>
          )}
          keyExtractor={(line) => line!.id!}
          style={styles.ListStyle}
        />
      </ScrollView>
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
    maxWidth: 640,
    paddingHorizontal: 8,
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
  },
});
