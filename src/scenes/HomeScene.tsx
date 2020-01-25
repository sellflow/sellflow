import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductList } from '../components';
import SearchBar from '../components/SearchBar';
import { carouselData } from '../fixtures/carousel';
import { StackNavProp } from '../types/Navigation';
import { CategoryItem, Product } from '../types/types';
import { GetCategoriesAndFeaturedProducts } from '../generated/server/GetCategoriesAndFeaturedProducts';
import { GET_CATEGORIES_AND_FEATURED_PRODUCTS } from '../graphql/server/categoriesAndFeaturedProducts';

export default function HomeScene() {
  let { screenSize, isLandscape } = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'Home'>>();

  let { loading, data } = useQuery<GetCategoriesAndFeaturedProducts>(
    GET_CATEGORIES_AND_FEATURED_PRODUCTS,
    { fetchPolicy: 'network-only' },
  );

  if (loading || !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let numColumns = screenSize === ScreenSize.Small ? 2 : isLandscape ? 5 : 4;

  let categoryData: Array<CategoryItem> = data.collections.edges.map(
    (item) => ({
      id: item.node.id,
      title: item.node.title,
    }),
  );

  // TODO: What about discount?
  let productData: Array<Product> = data.products.edges.map((item) => ({
    id: item.node.id,
    image: item.node.images.edges[0].node.originalSrc,
    title: item.node.title,
    price: Number(
      item.node.presentmentPriceRanges.edges[0].node.minVariantPrice.amount,
    ),
  }));

  let renderHeader = () => (
    <>
      <Carousel
        data={carouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={categoryData}
          onSelect={(collection) => {
            navigate('ProductCollection', { collection });
          }}
        />
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Featured Products')}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.flex}>
      <SearchBar />
      <ProductList
        ListHeaderComponent={renderHeader}
        data={productData}
        numColumns={numColumns}
        onItemPress={(product) => navigate('ProductDetails', { product })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
  },
  subTitleContainer: {
    marginHorizontal: 24,
  },
});
