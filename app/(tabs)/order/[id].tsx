import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { getAccessToken, getRefreshToken, discovery } from "@/lib/tokens";
import { getOrder } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import { Image } from "expo-image";
import OrderDetails from "@/components/OrderDetails";

export default function Order() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrder = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getOrder(accessToken, id);
      if (data.status !== 401 && data) {
        const parsedData = await data.json();
        return parsedData;
      } else if (data.status !== 401) {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          refreshUser({ discovery }).then(async () => {
            const accessToken = await getAccessToken();
            const data = await getOrder(accessToken!, id);
            const parsedData = await data.json();
            return parsedData;
          });
        }
      }
    }

    const refreshToken = await getAccessToken();
    if (refreshToken) {
      refreshUser({ discovery }).then(async () => {
        const accessToken = await getAccessToken();
        const data = await getOrder(accessToken!, id);
        return await data.json();
      });
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      const order = await fetchOrder();
      if (order) {
        setOrder(order);
      }
      setLoading(false);
    };

    loadOrder();
  }, []);

  return (
    <View style={styles.Container}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : order?.data?.order?.fulfillments?.edges[0]?.node
          ?.latestShipmentStatus !== "DELIVERED" ? (
        <Text style={{ color: "white" }}>
          Arriving:{" "}
          {order?.data?.order?.fulfillments?.edges[0]?.node?.estimatedDeliveryAt
            ? order?.data?.order?.fulfillments?.edges[0]?.node
                ?.estimatedDeliveryAt
            : "Unknown"}
        </Text>
      ) : (
        <OrderDetails order={order} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
