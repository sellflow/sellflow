import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { useSearchProductsQuery } from '../../hooks/api/useSearchProduct';
import { Product } from '../../types/types';
import { ProductSortKeys } from '../../generated/server/globalTypes';
import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { useGetHighestPrice } from '../../hooks/api/useHighestPriceProduct';
import { formatSliderValue } from '../../helpers/formatSliderValue';
import useDefaultCurrency from '../../hooks/api/useDefaultCurrency';
import { SearchModal } from '../../components';
import { useColumns } from '../../helpers/columns';

import { ProductsView } from './components';

export default function SearchResultsScene() {
  let maxPrice = useGetHighestPrice();
  let { maxPriceValue } = formatSliderValue(maxPrice);
  let defaultCurrency = useDefaultCurrency().data;
  let { navigate, setOptions } = useNavigation<StackNavProp<'SearchResults'>>();
  let numColumns = useColumns();
  let first = numColumns * 6;
  let [isSearchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  let [radioButtonValue, setRadioButtonValue] = useState<string>('');
  let [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    maxPriceValue,
  ]);
  let { params } = useRoute<StackRouteProp<'SearchResults'>>();

  let searchKeyword = params.searchKeyword;
  let {
    searchProducts,
    results,
    refetch,
    isFetchingMore,
    hasMore,
  } = useSearchProductsQuery();

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
        first,
        presentmentCurrencies: [defaultCurrency],
        searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
        sortKey: ProductSortKeys.BEST_SELLING,
      },
    });
  }, [searchKeyword]); // eslint-disable-line react-hooks/exhaustive-deps

  let onClearFilter = () => setPriceRange([0, maxPriceValue]);
  let onSetFilter = (values: [number, number]) => {
    setPriceRange(values);
    refetch('update', {
      first,
      searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
    });
  };
  let onPressRadioButton = (newValue: string) => {
    setRadioButtonValue(newValue);
    let { sortKey, reverse } = getSortKeys(newValue);
    refetch('update', {
      first,
      searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
      sortKey,
      reverse,
    });
  };
  let onSubmit = (searchKeyword: string) =>
    navigate('SearchResults', {
      searchKeyword,
    });
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
  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch('scroll', {
        searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
        first,
        after: results[results.length - 1].cursor || null,
      });
    }
  };

  return (
    <>
      <ProductsView
        products={results}
        onItemPress={onItemPress}
        hasMore={false}
        onEndReached={onEndReached}
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
