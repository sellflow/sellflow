import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList, SearchInput } from '../core-ui';
import { ProductList, SearchModal, CurrencyPicker } from '../components';
import { carouselData } from '../fixtures/carousel';
import { StackNavProp } from '../types/Navigation';
import { CategoryItem, Product } from '../types/types';
import { useColumns } from '../helpers/columns';
import { useCollectionAndProductQuery } from '../hooks/api/useCollection';
import { COLORS } from '../constants/colors';
import useDefaultCurrency from '../hooks/api/useDefaultCurrency';
import { getDiscount } from '../helpers/getDiscount';

export default function HomeScene() {
  let { navigate, setOptions } = useNavigation<StackNavProp<'Home'>>();
  let { screenSize } = useDimensions();
  let numColumns = useColumns();

  let [isSearchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  let [currencyCode, setCurrencyCode] = useState<string>('');

  let {
    loading: loadingHomeData,
    data: homeData,
  } = useCollectionAndProductQuery({
    variables: { presentmentCurrencies: [currencyCode] },
  });

  let {
    loading: loadingCurrency,
    data: defaultCurrency,
  } = useDefaultCurrency();

  useEffect(() => {
    if (defaultCurrency) {
      setCurrencyCode(defaultCurrency);
    }
  }, [defaultCurrency]);

  let onPressCurrency = (currency: string) => {
    setCurrencyCode(currency);
  };

  setOptions({
    headerLeft: () => <CurrencyPicker onPressCurrency={onPressCurrency} />,
  });

  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { product });
  };
  let onSubmit = (searchKeyword: string) =>
    navigate('SearchResults', {
      searchKeyword,
    });

  if (loadingHomeData || loadingCurrency || !homeData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  let categoryData: Array<CategoryItem> = homeData.collections.edges.map(
    (item) => ({
      id: item.node.id,
      title: item.node.title,
      handle: item.node.handle,
    }),
  );

  let productData: Array<Product> = homeData.products.edges.map((item) => {
    let originalProductPrice = ~~item.node.variants.edges[0].node
      .presentmentPrices.edges[0].node.compareAtPrice?.amount;

    let productPrice = ~~item.node.variants.edges[0].node.presentmentPrices
      .edges[0].node.price.amount;

    let { price, discount } = getDiscount(originalProductPrice, productPrice);

    return {
      id: item.node.id,
      cursor: item.cursor,
      image: item.node.images.edges[0].node.originalSrc,
      title: item.node.title,
      handle: item.node.handle,
      price: price,
      discount: discount,
      url: item.node.onlineStoreUrl,
    };
  });

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
            navigate('ProductCollection', {
              collection,
            });
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
      <TouchableOpacity
        onPress={() => setSearchModalVisible(true)}
        activeOpacity={1}
      >
        <View style={styles.searchInputContainer}>
          <SearchInput
            pointerEvents="none"
            placeholder={t('Search')}
            editable={false}
            style={styles.searchInput}
          />
        </View>
      </TouchableOpacity>
      <SearchModal
        onItemPress={onItemPress}
        onSubmit={onSubmit}
        isVisible={isSearchModalVisible}
        setVisible={setSearchModalVisible}
      />
      <ProductList
        ListHeaderComponent={renderHeader}
        data={productData}
        numColumns={numColumns}
        onItemPress={onItemPress}
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
  searchInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
});
