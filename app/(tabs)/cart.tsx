import LineItem from "@/components/LineItem";
import {
  CartCheckoutButton,
  CartLineProvider,
  useCart,
} from "@shopify/hydrogen-react";
import { Link } from "expo-router";
import { Text, View, StyleSheet, Platform, FlatList } from "react-native";

export default function Index() {
  const cart = useCart();
  return (
    <View style={styles.Container}>
      <Text style={styles.text}>Your cart</Text>
      {Platform.OS == "ios" || Platform.OS == "android" ? (
        <Link href="../checkout">Proceed to Checkout</Link>
      ) : (
        <CartCheckoutButton style={styles.Checkout}>
          <Text>Proceed to Checkout</Text>
        </CartCheckoutButton>
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
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  LineItemContainer: {
    width: "100%",
    marginBottom: 8,
  },
  ListStyle: {
    width: "100%",
    maxWidth: 640,
  },
  Checkout: {
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
    marginBottom: 4,
    width: "100%",
    maxWidth: 640,
  },
  text: {
    color: "#fff",
  },
});
