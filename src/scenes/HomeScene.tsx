import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductList } from '../components';
import SearchBar from '../components/SearchBar';
import { CarouselData } from '../fixtures/carousel';
import { ProductItemData } from '../fixtures/ProductItemData';
import { CategoryListData } from '../fixtures/CategoryListData';
import { StackNavProp } from '../types/Navigation';

export default function HomeScene() {
  let { screenSize, isLandscape } = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'Home'>>();

  let numColumns = screenSize === ScreenSize.Small ? 2 : isLandscape ? 5 : 4;

  let header = (
    <>
      <Carousel
        data={CarouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={CategoryListData}
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
        ListHeaderComponent={() => header}
        data={ProductItemData}
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
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
  },
  subTitleContainer: {
    marginHorizontal: 24,
  },
});
