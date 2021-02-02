import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton } from 'exoflex';
import { useNavigation, useRoute } from '@react-navigation/native';

import { SearchModal } from '../../components';
import { COLORS } from '../../constants/colors';
import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { useCollectionQuery } from '../../hooks/api/useCollection';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { ProductCollectionSortKeys } from '../../generated/server/globalTypes';
import { Product } from '../../types/types';
import { useColumns } from '../../helpers/columns';
import { useGetHighestPrice } from '../../hooks/api/useHighestPriceProduct';
import { formatSliderValue } from '../../helpers/formatSliderValue';

import { ProductsView } from './components';

export default function ProductCollectionScene() {
  let maxPrice = useGetHighestPrice();
  let { maxPriceValue } = formatSliderValue(maxPrice);

  let { navigate, setOptions } = useNavigation<
    StackNavProp<'ProductCollection'>
  >();

  let [isSearchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  let [radioButtonValue, setRadioButtonValue] = useState<string>('');
  let [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    maxPriceValue,
  ]);
  let { params } = useRoute<StackRouteProp<'ProductCollection'>>();
  const collectionHandle = params.collection.handle;
  let numColumns = useColumns();
  let first = numColumns * 6;

  let {
    collection,
    loading,
    hasMore,
    refetch,
    isFetchingMore,
  } = useCollectionQuery(collectionHandle, first, priceRange);

  let onClearFilter = () => setPriceRange([0, maxPriceValue]);
  let onSetFilter = (values: [number, number]) => {
    setPriceRange(values);
    refetch(
      'sort',
      {
        collectionHandle,
        first,
        after: null,
      },
      values,
    );
  };
  let onPressRadioButton = (newValue: string) => {
    setRadioButtonValue(newValue);
    let { sortKey, reverse } = getSortKeys(newValue);
    refetch('sort', {
      collectionHandle,
      first,
      after: null,
      sortKey,
      reverse,
    });
  };
  let getSortKeys = (value: string) => {
    let sortKey = ProductCollectionSortKeys.BEST_SELLING;
    let reverse = false;

    if (value === PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH) {
      sortKey = ProductCollectionSortKeys.PRICE;
    } else if (value === PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW) {
      sortKey = ProductCollectionSortKeys.PRICE;
      reverse = true;
    }

    return { sortKey, reverse };
  };

  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { productHandle: product.handle });
  };
  let onSubmit = (searchKeyword: string) =>
    navigate('SearchResults', {
      searchKeyword,
    });
  let onValuesChangeStart = () => {
    setOptions({
      gestureEnabled: false,
    });
  };
  let onValuesChangeFinish = () => {
    setOptions({
      gestureEnabled: true,
    });
  };
  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch('scroll', {
        collectionHandle,
        first,
        after: collection[collection.length - 1].cursor || null,
      });
    }
  };

  setOptions({
    headerRight: () => (
      <IconButton
        icon="magnify"
        onPress={() => setSearchModalVisible(true)}
        color={COLORS.primaryColor}
      />
    ),
  });

  if (loading && !isFetchingMore) {
    return <ActivityIndicator style={[styles.container, styles.center]} />;
  }

  return (
    <>
      <ProductsView
        products={collection}
        onItemPress={onItemPress}
        onEndReached={onEndReached}
        hasMore={hasMore}
        sortProps={{ radioButtonValue, onPressRadioButton }}
        filterProps={{
          priceRange,
          onClearFilter,
          onSetFilter,
          onValuesChangeStart,
          onValuesChangeFinish,
        }}
      />
      <SearchModal
        onItemPress={onItemPress}
        onSubmit={onSubmit}
        isVisible={isSearchModalVisible}
        setVisible={setSearchModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
