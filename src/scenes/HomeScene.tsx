import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductList, SearchBar } from '../components';
import { carouselData } from '../fixtures/carousel';
import { StackNavProp } from '../types/Navigation';
import { CategoryItem, Product } from '../types/types';
import { useColumns } from '../helpers/columns';
import { useCollectionAndProductQuery } from '../helpers/queries';

export default function HomeScene() {
  let { screenSize } = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'Home'>>();
  let numColumns = useColumns();

  let { loading, data } = useCollectionAndProductQuery();

  if (loading || !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let categoryData: Array<CategoryItem> = data.collections.edges.map(
    (item) => ({
      id: item.node.id,
      title: item.node.title,
      handle: item.node.handle,
    }),
  );

  // TODO: What about discount?
  let productData: Array<Product> = data.products.edges.map((item) => ({
    id: item.node.id,
    image: item.node.images.edges[0].node.originalSrc,
    title: item.node.title,
    handle: item.node.handle,
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
        columnWrapperStyle={styles.itemWrapperStyle}
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
    marginLeft: 24,
  },
  itemWrapperStyle: {
    marginHorizontal: 24,
  },
});
