import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'exoflex';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { useCollectionQuery } from '../../hooks/api/useCollection';

import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { ProductCollectionSortKeys } from '../../generated/server/globalTypes';
import { ProductsView } from './components';
import { Product } from '../../types/types';

const DEFAULT_MAX_PRICE = 1000;

export default function ProductCollectionScene() {
  let { navigate, setOptions } = useNavigation<
    StackNavProp<'ProductCollection'>
  >();
  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    DEFAULT_MAX_PRICE,
  ]);
  let { params } = useRoute<StackRouteProp<'ProductCollection'>>();
  const collectionHandle = params.collection.handle;

  let { data: collection, loading, refetch } = useCollectionQuery(
    collectionHandle,
    priceRange,
  );

  let onClearFilter = () => setPriceRange([0, DEFAULT_MAX_PRICE]);
  let onSetFilter = (values: [number, number]) => setPriceRange(values);
  let onPressRadioButton = (newValue: string) => {
    setRadioButtonValue(newValue);

    let sortKey = ProductCollectionSortKeys.BEST_SELLING;
    let reverse = false;

    if (newValue === PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH) {
      sortKey = ProductCollectionSortKeys.PRICE;
    } else if (newValue === PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW) {
      sortKey = ProductCollectionSortKeys.PRICE;
      reverse = true;
    }

    refetch({
      collectionHandle,
      sortKey,
      reverse,
    });
  };
  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { product });
  };
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

  if (loading) {
    return <ActivityIndicator style={[styles.container, styles.center]} />;
  }

  return (
    <ProductsView
      products={collection}
      onItemPress={onItemPress}
      sortProps={{ radioButtonValue, onPressRadioButton }}
      filterProps={{
        priceRange,
        onClearFilter,
        onSetFilter,
        onValuesChangeStart,
        onValuesChangeFinish,
      }}
    />
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
