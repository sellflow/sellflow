import { useCart } from "@/components/CartProvider";
import LineItem from "@/components/LineItem";
import { Colors } from "@/constants/Colors";
import { CartLineProvider } from "@shopify/hydrogen-react";
import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  FlatList,
  useColorScheme,
  ScrollView,
  Button,
} from "react-native";

export default function Index() {
  const cart = useCart();
  const colorScheme = useColorScheme();

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
      <View style={styles.Container}>
        <Text style={{ color: textColor }}>Your cart</Text>
        {Platform.OS == "ios" || Platform.OS == "android" ? (
          <Link href="../checkout">Proceed to Checkout</Link>
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
}

const styles = StyleSheet.create({
  ScrollContainer: {
    width: "100%",
  },
  Container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 640,
    paddingHorizontal: 16,
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
