import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { ErrorPage, ProductList, SearchModal } from '../components';
import { COLORS } from '../constants/colors';
import { Carousel, CategoryList, SearchInput, Text } from '../core-ui';
import { carouselData } from '../fixtures/carousel';
import { useColumns } from '../helpers/columns';
import { ScreenSize, useDimensions } from '../helpers/dimensions';
import { useNetwork } from '../helpers/useNetwork';
import { useProductsAndCategoriesQuery } from '../hooks/api/useCollection';
import { StackNavProp } from '../types/Navigation';
import { NetworkStateEnum, Product } from '../types/types';
import useDefaultCountry from '../hooks/api/useDefaultCountry';

export default function HomeScene() {
  let { navigate } = useNavigation<StackNavProp<'Home'>>();
  let { screenSize } = useDimensions();
  let numColumns = useColumns();
  let first = numColumns * 6;
  let { isConnected } = useNetwork();
  let [isSearchModalVisible, setSearchModalVisible] = useState(false);

  let {
    data: { countryCode },
    loading: loadingCountryCode,
  } = useDefaultCountry();

  let {
    loading: loadingHomeData,
    products,
    categories,
    refetch,
    hasMore,
    isFetchingMore,
    error,
  } = useProductsAndCategoriesQuery(first);

  useEffect(() => {
    refetch('update', {
      first,
      after: null,
      country: countryCode,
    });
  }, [countryCode]); // eslint-disable-line react-hooks/exhaustive-deps

  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { productHandle: product.handle });
  };
  let onSubmit = (searchKeyword: string) => {
    navigate('SearchResults', {
      searchKeyword,
    });
  };

  let onProductsEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch('scroll', {
        first,
        after: products[products.length - 1].cursor || null,
        country: countryCode,
      });
    }
  };

  if (isConnected === NetworkStateEnum.NOT_CONNECTED || error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch('update', {
            first,
            after: null,
            country: countryCode,
          })
        }
      />
    );
  }

  if ((loadingHomeData || loadingCountryCode || !products) && !isFetchingMore) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  let renderHeaderComponent = () => (
    <View>
      <Carousel
        data={carouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={categories}
          onSelect={(collection) => {
            navigate('ProductCollection', {
              collection,
            });
          }}
        />
      </View>
      <Text style={styles.subTitle}>{t('Featured Products')}</Text>
    </View>
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
        ListHeaderComponent={renderHeaderComponent()}
        data={products}
        numColumns={numColumns}
        onItemPress={onItemPress}
        columnWrapperStyle={styles.itemWrapperStyle}
        onEndReached={onProductsEndReached}
        onEndReachedThreshold={0.25}
        ListFooterComponent={() => {
          return hasMore ? (
            <ActivityIndicator style={styles.activityIndicator} />
          ) : null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 24,
  },
  itemWrapperStyle: {
    marginHorizontal: 12,
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
  activityIndicator: {
    marginVertical: 24,
  },
});
