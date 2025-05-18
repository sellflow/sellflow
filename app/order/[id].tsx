import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { getOrder } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import OrderDetails from "@/components/OrderDetails";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

export default function Order() {
  const { id } = useLocalSearchParams();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (accessToken) {
        const data = await getOrder(accessToken, id as string);
        if (data.status !== 401 && data) {
          return await data.json();
        } else if (data.status !== 401) {
          if (refreshToken) {
            refreshUser().then(async () => {
              const data = await getOrder(accessToken, id as string);
              return await data.json();
            });
          }
        }
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.Container}>
        {isPending ? <UniActivityIndicator /> : <OrderDetails order={data} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const UniActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.text,
}));

const styles = StyleSheet.create((theme) => ({
  Container: {
    width: "100%",
    backgroundColor: theme.colors.background,
  },
}));
