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
import { useQuery } from "@tanstack/react-query";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Page() {
  const { countryIsoCode, languageIsoCode } = useShop();
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const colorScheme = useColorScheme();
  const search = useLocalSearchParams();
  const selectedOptions = getProductOptions(search);

  const product = useQuery({
    queryKey: [
      "product",
      search?.id,
      accessToken,
      countryIsoCode,
      languageIsoCode,
    ],
    queryFn: async () => {
      const data = await getProduct(
        search?.id as string,
        selectedOptions,
        countryIsoCode,
        languageIsoCode,
        accessToken,
      );
      if (data.errors) {
        throw new Error("Failed to fetch product: ", data.errors);
      }

      return data.data.product;
    },
  });

  const recommended = useQuery({
    queryKey: [
      "recommended",
      search?.id,
      accessToken,
      countryIsoCode,
      languageIsoCode,
    ],
    queryFn: async () => {
      const data = await getProductRecommendations(
        search?.id as string,
        countryIsoCode,
        languageIsoCode,
        accessToken,
      );
      if (data.errors) {
        throw new Error(
          "Failed to fetch product recommendations: ",
          data.errors,
        );
      }

      return data.data.productRecommendations;
    },
  });

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
        {product.isPending ? (
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
              data={product.data}
              initialVariantId={product.data.selectedVariant?.id}
            >
              <Product search={search} />
            </ProductProvider>
            <View style={styles.recommendedContainer}>
              <Text style={[styles.recommendedHeading, { color: textColor }]}>
                <Trans>Recommended</Trans>
              </Text>
              {recommended.data && (
                <FlatList
                  data={recommended.data}
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
