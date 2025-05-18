import OrderItem from "@/components/OrderItem";
import { getOrders } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

export default function Orders() {
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["orders", accessToken],
    queryFn: async () => {
      if (accessToken) {
        const data = await getOrders(accessToken);
        // If access token is valid and data is present
        if (data.status !== 401 && data) {
          const parsedData = await data.json();
          return parsedData.data.customer.orders;
          // If access token is invalid and data is not present
        } else if (data.status !== 401) {
          refreshUser().then(async () => {
            const data = await getOrders(accessToken);
            const parsedData = await data.json();
            return parsedData.data.customer.orders;
          });
        }

        if (refreshToken) {
          refreshUser().then(async () => {
            const data = await getOrders(accessToken);
            const parsedData = await data.json();
            return parsedData.data.customer.orders;
          });
        }
      }
    },
  });

  return (
    <ScrollView style={styles.ScrollContainer}>
      {isPending ? (
        <UniActivityIndicator />
      ) : (
        <View style={styles.Container}>
          {data ? (
            <View style={styles.ListStyle}>
              {data.edges.length === 0 ? (
                <Text style={styles.Text}>No orders yet!</Text>
              ) : (
                data.edges?.map((order: any, index: number) => (
                  <View style={styles.ItemContainer} key={index}>
                    <OrderItem item={order} />
                  </View>
                ))
              )}
            </View>
          ) : (
            <Text style={styles.Text}>
              <Trans>No orders yet!</Trans>
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const UniActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.text,
}));

const styles = StyleSheet.create((theme) => ({
  ScrollContainer: {
    width: "100%",
    backgroundColor: theme.colors.background,
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
  Text: {
    color: theme.colors.text,
  },
}));
