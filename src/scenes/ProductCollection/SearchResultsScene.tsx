import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { useSearchProductsQuery } from '../../hooks/api/useSearchProduct';
import { ProductsView } from './components';
import { Product } from '../../types/types';

const DEFAULT_MAX_PRICE = 1000;

export default function SearchResultsScene() {
  let { navigate, setOptions } = useNavigation<StackNavProp<'SearchResults'>>();

  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    DEFAULT_MAX_PRICE,
  ]);
  let { params } = useRoute<StackRouteProp<'SearchResults'>>();

  let searchKeyword = params.searchKeyword;
  let { searchProducts, data: results } = useSearchProductsQuery();

  useEffect(() => {
    searchProducts({
      variables: {
        searchText: `${searchKeyword} variants.price:>${priceRange[0]} variants.price:<${priceRange[1]}`,
      },
    });
  }, [priceRange, searchKeyword, searchProducts]);

  let onClearFilter = () => setPriceRange([0, DEFAULT_MAX_PRICE]);
  let onSetFilter = (values: [number, number]) => {
    setPriceRange(values);
  };
  let onPressRadioButton = (newValue: string) => {
    setRadioButtonValue(newValue);
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

  return (
    <ProductsView
      products={results}
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
