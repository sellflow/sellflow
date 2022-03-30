import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';

import { useNavigation, useRoute } from '@react-navigation/native';

import { ErrorPage, SearchModal } from '../../components';
import { COLORS } from '../../constants/colors';
import { PRODUCT_SORT_VALUES } from '../../constants/values';
import { ProductCollectionSortKeys } from '../../generated/server/globalTypes';
import { useColumns } from '../../helpers/columns';
import { useCollectionQuery } from '../../hooks/api/useCollection';
import { useGetHighestPrice } from '../../hooks/api/useHighestPriceProduct';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { Product } from '../../types/types';

import { ProductsView } from './components';
import useDefaultCountry from '../../hooks/api/useDefaultCountry';

export default function ProductCollectionScene() {
  let { navigate, setOptions } = useNavigation<
    StackNavProp<'ProductCollection'>
  >();

  let [isSearchModalVisible, setSearchModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [maxPriceValue, setMaxPrice] = useState(0);
  let [priceRange, setPriceRange] = useState<Array<number>>([0, maxPriceValue]);
  let {
    params: {
      collection: { handle },
    },
  } = useRoute<StackRouteProp<'ProductCollection'>>();
  const collectionHandle = handle;
  let numColumns = useColumns();
  let first = numColumns * 6;
  let {
    data: { countryCode },
  } = useDefaultCountry();

  let {
    collection,
    loading,
    hasMore,
    refetch,
    isFetchingMore,
    error,
  } = useCollectionQuery(collectionHandle, first, priceRange);

  let { loading: maxPriceLoading } = useGetHighestPrice({
    onCompleted: (value) => {
      setMaxPrice(value);
      setPriceRange([0, value]);
    },
    skip: maxPriceValue !== 0,
  });

  let onClearFilter = () => setPriceRange([0, maxPriceValue]);
  let onSetFilter = (values: Array<number>) => {
    setPriceRange(values);
    refetch(
      'sort',
      {
        collectionHandle,
        first,
        after: null,
        country: countryCode,
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
      country: countryCode,
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

  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch('scroll', {
        collectionHandle,
        first,
        after: collection[collection.length - 1].cursor || null,
        country: countryCode,
      });
    }
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <IconButton
          icon="magnify"
          onPress={() => setSearchModalVisible(true)}
          color={COLORS.primaryColor}
        />
      ),
    });
  }, [setOptions]);

  if (error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch('sort', {
            collectionHandle,
            first,
            after: null,
            country: countryCode,
          })
        }
      />
    );
  }
  if (loading && !isFetchingMore && maxPriceLoading) {
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
