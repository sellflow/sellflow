import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSearchResults } from "@/shopify/search";
import { useCallback, useEffect, useState } from "react";
import { ClientResponse } from "@shopify/storefront-api-client";
import { ProductQuery } from "@/types/storefront.generated";
import RecommendedProduct from "@/components/RecommendedProduct";
import { Colors } from "@/constants/Colors";
import Product from "@/components/ProductCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Search() {
  const colorScheme = useColorScheme();
  const { query } = useLocalSearchParams();
  const [products, setProducts] = useState<
    ClientResponse<ProductQuery> | undefined
  >();
  const [filters, setFilters] = useState({});

  const searchProducts = useCallback(async () => {
    const res = await getSearchResults(query as string, filters);
    setProducts(res);
    console.log("SEARCH PRODUCT: ", products);
  }, [query, filters]);

  useEffect(() => {
    try {
      searchProducts();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <ScrollView
      style={[styles.Container, { backgroundColor: backgroundColor }]}
    >
      <View style={styles.ContentContainer}>
        {products ? (
          <>
            <Text style={[styles.Heading, { color: textColor }]}>
              Showing results for "{query}"
            </Text>
            <FlatList
              data={products?.data?.search.edges}
              //@ts-ignore
              renderItem={({ item }) => <Product item={item} />}
              keyExtractor={(item) => item.node.id}
              numColumns={SCREEN_WIDTH > 640 ? 4 : 2}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: SCREEN_WIDTH > 640 ? 16 : 0,
                    height: 16,
                  }}
                />
              )}
              style={styles.ProductContainer}
              columnWrapperStyle={{
                justifyContent: "space-between",
                width: "100%",
              }}
              ListFooterComponent={() => <View style={{ height: 128 }} />}
            />
          </>
        ) : (
          <ActivityIndicator color={textColor} />
        )}
      </View>
    </ScrollView>
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
    gap: SCREEN_WIDTH > 640 ? 16 : 4,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
