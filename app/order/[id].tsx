import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { getOrder } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import OrderDetails from "@/components/OrderDetails";
import { Colors } from "@/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";

export default function Order() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );
  const colorScheme = useColorScheme();

  const fetchOrder = async () => {
    if (accessToken) {
      const data = await getOrder(accessToken, id);
      if (data.status !== 401 && data) {
        const parsedData = await data.json();
        return parsedData;
      } else if (data.status !== 401) {
        if (refreshToken) {
          refreshUser().then(async () => {
            const data = await getOrder(accessToken, id);
            const parsedData = await data.json();
            return parsedData;
          });
        }
      }
      if (refreshToken) {
        refreshUser().then(async () => {
          const data = await getOrder(accessToken, id);
          return await data.json();
        });
      }
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

  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[styles.Container, { backgroundColor }]}>
        {loading ? (
          <ActivityIndicator
            color={
              colorScheme === "light" ? Colors.light.text : Colors.dark.text
            }
          />
        ) : (
          <OrderDetails order={order} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
  },
});
