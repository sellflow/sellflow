import OrderItem from "@/components/OrderItem";
import { getOrders } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import { discovery, getAccessToken, getRefreshToken } from "@/lib/tokens";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const imageSize = 100;

export default function Orders() {
  const [loading, setLoading] = useState<boolean>();
  const [orders, setOrders] = useState({});
  const fetchOrders = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getOrders(accessToken);
      if (data.status !== 401 && data) {
        const parsedData = await data.json();
        return parsedData;
      } else if (data.status !== 401) {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          refreshUser({ discovery }).then(async () => {
            const accessToken = await getAccessToken();
            const data = await getOrders(accessToken!);
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
        const data = await getOrders(accessToken!);
        return await data.json();
      });
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrders();
      if (data) {
        setOrders(data);
      }
    };

    loadOrders();
  }, []);
  return (
    <View style={styles.Container}>
      {loading ? (
        typeof orders === "object" && Object.keys(orders).length > 0 ? (
          <>
            <Text style={{ color: "white" }}>Orders</Text>

            <FlatList
              data={orders.data.customer.orders.edges}
              style={styles.ListStyle}
              keyExtractor={(item) => item.node.id}
              renderItem={({ item }) => <OrderItem item={item} />}
              contentContainerStyle={styles.ItemContainer}
            />
          </>
        ) : (
          <Text>No orders yet!</Text>
        )
      ) : (
        <ActivityIndicator color="#fff" />
      )}
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
  ItemContainer: {
    width: "100%",
    marginBottom: 8,
    flexDirection: "row",
  },
  ListStyle: {
    width: "100%",
    maxWidth: 640,
  },
});
