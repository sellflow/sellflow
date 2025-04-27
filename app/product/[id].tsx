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
import { ProductProvider, useShop } from "@shopify/hydrogen-react";
import { ProductQuery } from "@/types/storefront.generated";
import { getProductOptions } from "@/shopify/client";
import { getProduct, getProductRecommendations } from "@/shopify/product";
import Product from "@/components/Product";
import RecommendedProduct from "@/components/RecommendedProduct";
import { Colors } from "@/constants/Colors";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import ProductSkeleton from "@/components/ProductSkeleton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Page() {
  const { countryIsoCode, languageIsoCode } = useShop();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const colorScheme = useColorScheme();
  const search = useLocalSearchParams();
  const [product, setProduct] = useState<
    ClientResponse<ProductQuery> | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommended, setRecommended] = useState<ClientResponse<any>>();
  const selectedOptions = getProductOptions(search);

  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        setLoadingRecommendations(true);

        try {
          const [productData, recommendedData] = await Promise.all([
            getProduct(
              search?.id as string,
              selectedOptions,
              countryIsoCode,
              languageIsoCode,
              accessToken,
            ),
            getProductRecommendations(
              search?.id as string,
              countryIsoCode,
              languageIsoCode,
              accessToken,
            ),
          ]);

          // Handle product data errors
          if (productData?.errors?.graphQLErrors) {
            //@ts-ignore
            throw new Error(productData.errors.graphQLErrors);
          }

          // Handle recommendation data errors
          if (recommendedData?.errors?.graphQLErrors) {
            //@ts-ignore
            throw new Error(recommendedData.errors.graphQLErrors);
          }

          // Update state with fetched data
          setProduct(productData);
          setRecommended(recommendedData);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle errors appropriately - perhaps set error state
        } finally {
          // Always reset loading states regardless of success/failure
          setLoading(false);
          setLoadingRecommendations(false);
        }
      };

      fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [search?.id]);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
        ]}
      >
        {loading ? (
          <View style={styles.product}>
            <ProductSkeleton />
            <View style={styles.recommendedContainer}>
              <Text style={[styles.recommendedHeading, { color: textColor }]}>
                <Trans>Recommended</Trans>
              </Text>
              {[0, 1, 2, 3, 4, 5].map((item, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.product}>
            <ProductProvider
              data={product!.data!.product}
              initialVariantId={product!.data!.product?.selectedVariant?.id}
            >
              <Product search={search} />
            </ProductProvider>
            <View style={styles.recommendedContainer}>
              <Text style={[styles.recommendedHeading, { color: textColor }]}>
                <Trans>Recommended</Trans>
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
