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
      {products ? (
        <>
          <Text style={[styles.Heading, { color: textColor }]}>Products</Text>
          <FlatList
            data={products?.data?.products.edges}
            //@ts-ignore
            renderItem={({ item }) => <Product item={item} />}
            keyExtractor={(item) => item.node.id}
            horizontal={SCREEN_WIDTH > 640 ? true : false}
            numColumns={SCREEN_WIDTH > 640 ? 1 : 2}
            scrollEnabled={SCREEN_WIDTH > 640}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: SCREEN_WIDTH > 640 ? 16 : 0,
                  height: 16,
                }}
              />
            )}
            style={styles.ProductContainer}
            {...(SCREEN_WIDTH < 640 && {
              columnWrapperStyle: {
                ...{ justifyContent: "space-between", width: "100%" },
              },
            })}
            ListFooterComponent={() => <View style={{ height: 128 }} />}
          />
        </>
      ) : (
        <ActivityIndicator color={textColor} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    paddingVertical: 48,
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
