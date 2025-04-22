import { Colors } from "@/constants/Colors";
import { getOptimizedImageUrl } from "@/lib/utils";
import { t } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { mapSelectedProductOptionToObject } from "@shopify/hydrogen-react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Button, SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "react-native";

export default function OrderDetails({ order }: { order: any }) {
  const { i18n } = useLingui();
  const colorScheme = useColorScheme();

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}>
        <View style={{ width: "100%" }}>
          <Text style={[styles.Heading, { color: textColor }]}>
            <Trans>Order Details</Trans>
          </Text>
          <View style={styles.SummaryContainer}>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Order Date</Trans>
              </Text>
              <Text style={{ color: textColor }}>
                <Trans>{i18n.date(order?.data?.order.createdAt)}</Trans>
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Order Number</Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.number}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Order total</Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.totalPrice &&
                  i18n.number(order?.data?.order?.totalPrice?.amount, {
                    style: "currency",
                    currency: order?.data?.order?.totalPrice?.currencyCode,
                  })}
              </Text>
            </View>
            <Button title={t`Cancel items`} />
          </View>
        </View>
        {order?.data?.order.requiresShipping && (
          <>
            <View style={{ width: "100%" }}>
              <Text style={[styles.Heading, { color: textColor }]}>
                <Trans>Shipment Details</Trans>
              </Text>
              <View style={styles.SummaryContainer}>
                {order.data.order.lineItems.edges.map((item: any) => (
                  <View key={item.node.image.url} style={{ width: "100%" }}>
                    <Link
                      href={{
                        pathname: "/product/[id]",
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
                            <Trans>Quantity: {item.node.quantity}</Trans>
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor }}>
                        {i18n.number(item.node.price.amount, {
                          style: "currency",
                          currency: item.node.price.currencyCode,
                        })}
                      </Text>
                    </Link>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={[styles.Heading, { color: textColor }]}>
                <Trans>Shipping Address</Trans>
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
            <Trans>Order Summary</Trans>
          </Text>
          <View style={styles.SummaryContainer}>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Items:</Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.subtotal &&
                  i18n.number(order?.data.order.subtotal.amount, {
                    style: "currency",
                    currency: order.data.order.subtotal.currencyCode,
                  })}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Shipping & Handling</Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.totalShipping &&
                  i18n.number(order?.data.order.totalShipping.amount, {
                    style: "currency",
                    currency: order.data.order.totalShipping.currencyCode,
                  })}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Total Tip: </Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.totalTip &&
                  i18n.number(order?.data.order.totalTip.amount, {
                    style: "currency",
                    currency: order.data.order.totalTip.currencyCode,
                  })}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Tax: </Trans>{" "}
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.totalTax &&
                  i18n.number(order?.data.order.totalTax.amount, {
                    style: "currency",
                    currency: order.data.order.totalTax.currencyCode,
                  })}
              </Text>
            </View>
            <View style={styles.InfoContainer}>
              <Text style={{ color: textColor }}>
                <Trans>Total: </Trans>
              </Text>
              <Text style={{ color: textColor }}>
                {order?.data?.order?.totalPrice &&
                  i18n.number(order?.data.order.totalPrice.amount, {
                    style: "currency",
                    currency: order.data.order.totalPrice.currencyCode,
                  })}
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
