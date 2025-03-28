import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ClientResponse } from "@shopify/storefront-api-client";
import { ProductQuery } from "@/types/storefront.generated";
import { getProductOptions } from "@/shopify/client";
import { getProduct, getProductRecommendations } from "@/shopify/product";
import { ProductProvider } from "@shopify/hydrogen-react";
import Product from "@/components/Product";
import RecommendedProduct from "@/components/RecommendedProduct";

export default function Page() {
  const search = useLocalSearchParams();
  const [product, setProduct] = useState<
    ClientResponse<ProductQuery> | undefined
  >();
  const [recommended, setRecommended] = useState<ClientResponse<any>>();
  const selectedOptions = getProductOptions(search);

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const data = await getProduct(search?.id as string, selectedOptions);
        if (data?.errors?.graphQLErrors) {
          //@ts-ignore
          throw new Error(data.errors.graphQLErrors);
        }

        setProduct(data);
      };
      fetchProduct();

      const fetchRecommended = async () => {
        const data = await getProductRecommendations(search?.id as string);
        if (data?.errors?.graphQLErrors) {
          //@ts-ignore
          throw new Error(data.errors?.graphQLErrors);
        }

        setRecommended(data);
      };

      fetchRecommended();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <View style={{ paddingTop: 64 }}>
          <ProductProvider
            data={product!.data!.product}
            initialVariantId={product!.data!.product?.selectedVariant?.id}
          >
            <Product search={search} />
          </ProductProvider>
          <Text style={styles.recommendedHeading}>Recommended</Text>
          {recommended?.data?.productRecommendations && (
            <FlatList
              data={recommended.data.productRecommendations}
              renderItem={({ item }) => <RecommendedProduct item={item} />}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedItemsContainer}
            />
          )}
        </View>
      ) : (
        <ActivityIndicator color="#fff" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  recommendedHeading: {
    fontSize: 20,
    fontWeight: 600,
    color: "white",
    paddingTop: 128,
    paddingBottom: 4,
  },
  recommendedItemsContainer: {
    maxWidth: 1000,
    gap: 16,
    paddingBottom: 256,
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
