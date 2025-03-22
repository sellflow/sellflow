import { ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ClientResponse } from "@shopify/storefront-api-client";
import { ProductQuery } from "@/types/storefront.generated";
import { getProductOptions } from "@/shopify/client";
import Button from "@/components/Button";
import { getProduct } from "@/shopify/product";
import { ProductProvider } from "@shopify/hydrogen-react";
import Product from "@/components/Product";

export default function Page() {
  const search = useLocalSearchParams();
  const [product, setProduct] = useState<
    ClientResponse<ProductQuery> | undefined
  >();
  const selectedOptions = getProductOptions(search);

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const data = await getProduct(
          search?.handle as string,
          selectedOptions,
        );
        if (data?.errors?.graphQLErrors) {
          //@ts-ignore
          throw new Error(data.errors.graphQLErrors);
        }

        setProduct(data);
      };
      fetchProduct();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <ProductProvider
          data={product!.data!.product}
          initialVariantId={product!.data!.product?.selectedVariant?.id}
        >
          <Product search={search} />
        </ProductProvider>
      ) : (
        <ActivityIndicator color="#fff" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
