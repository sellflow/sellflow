import OrderItem from "@/components/OrderItem";
import { getOrders } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";

export default function Orders() {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState<boolean>();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );
  const colorScheme = useColorScheme();

  const fetchOrders = async () => {
    if (accessToken) {
      const data = await getOrders(accessToken);
      // If access token is valid and data is present
      if (data.status !== 401 && data) {
        const parsedData = await data.json();
        return parsedData;
        // If access token is invalid and data is not present
      } else if (data.status !== 401) {
        refreshUser().then(async () => {
          const data = await getOrders(accessToken);
          const parsedData = await data.json();
          return parsedData;
        });
      }

      if (refreshToken) {
        refreshUser().then(async () => {
          const data = await getOrders(accessToken);
          const parsedData = await data.json();
          return parsedData;
        });
      }
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
            <View style={styles.ListStyle}>
              {orders?.data?.customer?.orders?.edges?.map(
                (order: any, index: number) => (
                  <View style={styles.ItemContainer} key={index}>
                    <OrderItem item={order} />
                  </View>
                ),
              )}
            </View>
          ) : (
            <Text style={{ color: textColor }}>
              <Trans>No orders yet!</Trans>
            </Text>
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
    flexDirection: "row",
  },
  ListStyle: {
    width: "100%",
    maxWidth: 600,
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
