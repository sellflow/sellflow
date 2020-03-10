import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { useSearchProductsQuery } from '../../hooks/api/useSearchProduct';
import { ProductsView } from './components';
import { Product } from '../../types/types';
import { ProductSortKeys } from '../../generated/server/globalTypes';
import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { useGetHighestPrice } from '../../hooks/api/useHighestPriceProduct';
import { formatSliderValue } from '../../helpers/formatSliderValue';

export default function SearchResultsScene() {
  let maxPrice = useGetHighestPrice();
  let { maxPriceValue } = formatSliderValue(maxPrice);

  let { navigate, setOptions } = useNavigation<StackNavProp<'SearchResults'>>();

  let [radioButtonValue, setRadioButtonValue] = useState<string>('');
  let [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    maxPriceValue,
  ]);
  let [sortVariables, setSortVariables] = useState({
    sortKey: ProductSortKeys.ID,
    reverse: false,
  });
  let { params } = useRoute<StackRouteProp<'SearchResults'>>();

  let searchKeyword = params.searchKeyword;
  let { searchProducts, data: results } = useSearchProductsQuery();

  let getSortKeys = (value: string) => {
    let sortKey = ProductSortKeys.BEST_SELLING;
    let reverse = false;

    if (value === PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH) {
      sortKey = ProductSortKeys.PRICE;
    } else if (value === PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW) {
      sortKey = ProductSortKeys.PRICE;
      reverse = true;
    }

    return { sortKey, reverse };
  };

  useEffect(() => {
    searchProducts({
      variables: {
        searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
        sortKey: sortVariables.sortKey,
        reverse: sortVariables.reverse,
      },
    });
  }, [
    priceRange,
    searchKeyword,
    searchProducts,
    sortVariables.reverse,
    sortVariables.sortKey,
  ]);

  let onClearFilter = () => setPriceRange([0, maxPriceValue]);
  let onSetFilter = (values: [number, number]) => {
    setPriceRange(values);
  };
  let onPressRadioButton = (newValue: string) => {
    setRadioButtonValue(newValue);
    setSortVariables(getSortKeys(newValue));
  };
  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { productHandle: product.handle });
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
      hasMore={false}
      onEndReached={() => {}}
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
