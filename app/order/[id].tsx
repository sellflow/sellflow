import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { getOrder } from "@/shopify/order";
import { refreshUser } from "@/lib/auth";
import OrderDetails from "@/components/OrderDetails";
import { Colors } from "@/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

export default function Order() {
  const { id } = useLocalSearchParams();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );
  const colorScheme = useColorScheme();

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

  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[styles.Container, { backgroundColor }]}>
        {isPending ? (
          <ActivityIndicator
            color={
              colorScheme === "light" ? Colors.light.text : Colors.dark.text
            }
          />
        ) : (
          <OrderDetails order={data} />
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
