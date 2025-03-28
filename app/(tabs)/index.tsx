import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { getProducts } from "@/shopify/product";
import { GetProductsQuery } from "@/types/storefront.generated";
import { ClientResponse } from "@shopify/storefront-api-client";
import Product from "@/components/ProductCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Index() {
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

  return (
    <ScrollView style={styles.container}>
      {products ? (
        <>
          <Text style={styles.heading}>Products</Text>
          <FlatList
            data={products?.data?.products.edges}
            renderItem={({ item }) => <Product item={item} />}
            keyExtractor={(item) => item.node.id}
            horizontal={SCREEN_WIDTH > 640 ? true : false}
            numColumns={SCREEN_WIDTH > 640 ? 1 : 2}
            ItemSeparatorComponent={() => (
              <View style={{ width: SCREEN_WIDTH > 640 ? 16 : 0 }} />
            )}
            style={styles.productContainer}
            {...(SCREEN_WIDTH < 640 && {
              columnWrapperStyle: {
                ...{ justifyContent: "space-between", width: "100%" },
              },
            })}
          />
        </>
      ) : (
        <ActivityIndicator color="#fff" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: "white",
    paddingLeft: 8,
  },
  productContainer: {
    gap: SCREEN_WIDTH > 640 ? 16 : 4,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
