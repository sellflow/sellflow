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
import { useEffect, useState } from "react";
import { ClientResponse } from "@shopify/storefront-api-client";
import { ProductQuery } from "@/types/storefront.generated";
import { getProductOptions } from "@/shopify/client";
import { getProduct, getProductRecommendations } from "@/shopify/product";
import { ProductProvider } from "@shopify/hydrogen-react";
import Product from "@/components/Product";
import RecommendedProduct from "@/components/RecommendedProduct";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Page() {
  const colorScheme = useColorScheme();
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
        console.log(product);
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

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {product ? (
          <View style={styles.product}>
            <ProductProvider
              data={product!.data!.product}
              initialVariantId={product!.data!.product?.selectedVariant?.id}
            >
              <Product search={search} />
            </ProductProvider>
            <View style={styles.recommendedContainer}>
              <Text style={[styles.recommendedHeading, { color: textColor }]}>
                Recommended
              </Text>
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
          </View>
        ) : (
          <ActivityIndicator color={textColor} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: SCREEN_WIDTH,
  },
  product: {
    alignItems: "center",
  },
  recommendedContainer: {
    paddingLeft: SCREEN_WIDTH > 640 ? 0 : 16,
    maxWidth: SCREEN_WIDTH > 1175 ? 1175 : SCREEN_WIDTH,
    width: "100%",
  },
  recommendedHeading: {
    fontSize: 20,
    fontWeight: 600,
    paddingTop: 128,
    paddingBottom: 4,
  },
  recommendedItemsContainer: {
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
