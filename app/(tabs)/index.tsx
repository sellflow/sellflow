import { FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getProducts } from "@/shopify/product";
import { GetProductsQuery } from "@/types/storefront.generated";
import { ClientResponse } from "@shopify/storefront-api-client";
import Product from "@/components/ProductCard";

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
    <View>
      <Text style={styles.heading}>Products</Text>
      {products ? (
        <FlatList
          data={products?.data?.products.edges}
          renderItem={({ item }) => (
            <Product item={item} key={item.node.handle} />
          )}
          contentContainerStyle={styles.productContainer}
          horizontal
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: "white",
    paddingLeft: 16,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
