import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { getProducts } from "@/shopify/product";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Product from "@/components/ProductCard";
import { Colors } from "@/constants/Colors";
import { useShop } from "@shopify/hydrogen-react";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { refreshUser } from "@/lib/auth";

export default function Index() {
  const colorScheme = useColorScheme();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const { languageIsoCode, countryIsoCode } = useShop();
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      await refreshUser();
      return true;
    },
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["products", accessToken],
    queryFn: async () => {
      const data = await getProducts(
        countryIsoCode,
        languageIsoCode,
        accessToken,
      );
      if (data.errors) {
        //@ts-ignore
        throw new Error("Failed to fetch products: ", data.errors);
      }

      return data.data.products;
    },
  });

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[styles.Container, { backgroundColor: backgroundColor }]}
      >
        <View style={styles.ContentContainer}>
          <Text style={[styles.Heading, { color: textColor }]}>
            <Trans>Products</Trans>
          </Text>
          {!isError ? (
            isPending ? (
              <View style={styles.ProductContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </View>
            ) : (
              <>
                <View style={styles.ProductContainer}>
                  {data.edges?.map(({ node }: { node: any }, index: number) => (
                    <Product node={node} key={index} />
                  ))}
                </View>
              </>
            )
          ) : (
            <Trans>An unexpected error has occured: {error.message}</Trans>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
  },
  ContentContainer: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  Heading: {
    fontSize: 20,
    fontWeight: 600,
    paddingLeft: 8,
  },
  ProductContainer: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
