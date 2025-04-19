import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { getProducts } from "@/shopify/product";
import { GetProductsQuery } from "@/types/storefront.generated";
import { ClientResponse } from "@shopify/storefront-api-client";
import Product from "@/components/ProductCard";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Index() {
  const colorScheme = useColorScheme();
  const [products, setProducts] = useState<
    ClientResponse<GetProductsQuery> | undefined
  >();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data.errors) {
          console.error(data.errors.graphQLErrors);
          throw new Error("Failed to fetch products");
        }
        setProducts(data);
      } catch (e) {
        console.error(`Error fetching products ${e}`);
      }
    };
    fetchProducts();
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
            <Text style={[styles.Heading, { color: textColor }]}>Products</Text>
            <View style={styles.ProductContainer}>
              {products?.data?.products?.edges?.map(({ node }, index) => (
                <Product node={node} key={index} />
              ))}
            </View>
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
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
