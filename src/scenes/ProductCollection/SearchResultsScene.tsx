import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { SearchModal } from '../../components';
import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { ProductSortKeys } from '../../generated/server/globalTypes';
import { useColumns } from '../../helpers/columns';
import useDefaultCurrency from '../../hooks/api/useDefaultCurrency';
import { useGetHighestPrice } from '../../hooks/api/useHighestPriceProduct';
import { useSearchProductsQuery } from '../../hooks/api/useSearchProduct';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { Product } from '../../types/types';

import { ProductsView } from './components';

export default function SearchResultsScene() {
  let { data: defaultCurrency } = useDefaultCurrency();
  let { navigate } = useNavigation<StackNavProp<'SearchResults'>>();
  let numColumns = useColumns();
  let first = numColumns * 6;
  let [isSearchModalVisible, setSearchModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [maxPriceValue, setMaxPrice] = useState(0);
  let [priceRange, setPriceRange] = useState<Array<number>>([0, maxPriceValue]);
  let {
    params: { searchKeyword },
  } = useRoute<StackRouteProp<'SearchResults'>>();

  let { loading: maxPriceLoading } = useGetHighestPrice({
    onCompleted: (value) => {
      setMaxPrice(value);
    },
    skip: maxPriceValue !== 0,
  });

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
  let onSetFilter = (values: Array<number>) => {
    setPriceRange(values);
    refetch('update', {
      first,
      searchText: `${searchKeyword} variants.price:>=${values[0]} variants.price:<=${values[1]}`,
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

  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch('scroll', {
        searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
        first,
        after: results[results.length - 1].cursor || null,
      });
    }
  };

  if (!isFetchingMore && maxPriceLoading) {
    return <ActivityIndicator style={[styles.container, styles.center]} />;
  }

  return (
    <>
      <ProductsView
        products={results}
        onItemPress={onItemPress}
        hasMore={false}
        onEndReached={onEndReached}
        sortProps={{ radioButtonValue, onPressRadioButton }}
        filterProps={{
          maxPrice: maxPriceValue,
          priceRange,
          onClearFilter,
          onSetFilter,
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
