import { Colors } from "@/constants/Colors";
import { getOptimizedImageUrl } from "@/lib/utils";
import { mapSelectedProductOptionToObject } from "@shopify/hydrogen-react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Button, SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "react-native";

export default function OrderDetails({ order }: { order: any }) {
  const colorScheme = useColorScheme();

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}>
        <View style={{ width: "100%" }}>
          <Text style={[styles.Heading, { color: textColor }]}>
            Order details
          </Text>
          <View style={styles.SummaryContainer}>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Order date</Text>
              <Text style={{ color: textColor }}>
                {new Date(order?.data?.order.createdAt).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  },
                )}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Order #</Text>{" "}
              <Text style={{ color: textColor }}>
                {order?.data?.order?.number}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Order total</Text>
              <Text style={{ color: textColor }}>
                ${order?.data?.order?.totalPrice?.amount}
              </Text>
            </View>
            <Button title="Cancel items" />
          </View>
        </View>
        {order?.data?.order.requiresShipping && (
          <>
            <View style={{ width: "100%" }}>
              <Text style={[styles.Heading, { color: textColor }]}>
                Shipment details
              </Text>
              <View style={styles.SummaryContainer}>
                {order.data.order.lineItems.edges.map((item: any) => (
                  <View key={item.node.image.url} style={{ width: "100%" }}>
                    <Link
                      href={{
                        pathname: "/(tabs)/product/[id]",
                        params: {
                          id: item.node.productId,
                          ...mapSelectedProductOptionToObject(
                            item!.node!.variantOptions,
                          ),
                        },
                      }}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 4 }}>
                        <Image
                          source={{
                            uri: getOptimizedImageUrl(item.node.image.url, 100),
                          }}
                          style={{ width: 100, height: 100, borderRadius: 4 }}
                        />
                        <View style={{ gap: 4 }}>
                          <Text style={{ color: textColor }}>
                            {item.node.name}
                          </Text>
                          <Text style={{ color: textColor }}>
                            Quantity: {item.node.quantity}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor }}>
                        ${item.node.price.amount}
                      </Text>
                    </Link>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={[styles.Heading, { color: textColor }]}>
                Shipping Address
              </Text>
              <View style={styles.SummaryContainer}>
                <Text style={{ color: textColor }}>
                  {order.data.order.shippingAddress.firstName}{" "}
                  {order.data.order.shippingAddress.lastName}
                </Text>
                <Text style={{ color: textColor }}>
                  {order.data.order.shippingAddress.address1}
                </Text>
                <Text style={{ color: textColor }}>
                  {order.data.order.shippingAddress.formattedArea}
                </Text>
                <Text style={{ color: textColor }}>
                  {order.data.order.shippingAddress.country}
                </Text>
              </View>
            </View>
          </>
        )}
        <View style={{ width: "100%" }}>
          <Text style={[styles.Heading, { color: textColor }]}>
            Order Summary
          </Text>
          <View style={styles.SummaryContainer}>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Items:</Text>
              <Text style={{ color: textColor }}>
                ${order?.data.order.subtotal.amount}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Shipping & Handling: </Text>
              <Text style={{ color: textColor }}>
                ${order?.data.order.totalShipping.amount}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Total Tip: </Text>
              <Text style={{ color: textColor }}>
                ${order?.data.order.totalTip.amount}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Tax: </Text>
              <Text style={{ color: textColor }}>
                ${order?.data.order.totalTax.amount}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>Total: </Text>
              <Text style={{ color: textColor }}>
                ${order?.data.order.totalPrice.amount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    maxWidth: 640,
    gap: 48,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  InfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SummaryContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  Heading: {
    fontSize: 18,
    marginBottom: 8,
  },
});
