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
  useColorScheme,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";

const imageSize = 100;

export default function Orders() {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState<boolean>();
  const colorScheme = useColorScheme();

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
      setLoading(false);
    };

    loadOrders();
  }, []);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <ScrollView style={[styles.ScrollContainer, { backgroundColor }]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.Container}>
          {typeof orders === "object" && Object.keys(orders).length > 0 ? (
            <>
              <Text style={{ color: textColor }}>Orders</Text>

              <FlatList
                data={orders.data.customer.orders.edges}
                style={styles.ListStyle}
                keyExtractor={(item) => item.node.id}
                renderItem={({ item }) => (
                  <View style={styles.ItemContainer}>
                    <OrderItem item={item} />
                  </View>
                )}
              />
            </>
          ) : (
            <Text style={{ color: textColor }}>No orders yet!</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollContainer: {
    width: "100%",
  },
  Container: {
    width: "100%",
    maxWidth: 640,
    paddingHorizontal: 16,
    alignSelf: "center",
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
