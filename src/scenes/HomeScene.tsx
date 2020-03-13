import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList, SearchInput } from '../core-ui';
import { ProductList, SearchModal, CurrencyPicker } from '../components';
import { carouselData } from '../fixtures/carousel';
import { StackNavProp } from '../types/Navigation';
import { Product } from '../types/types';
import { useColumns } from '../helpers/columns';
import { useCollectionAndProductQuery } from '../hooks/api/useCollection';
import { COLORS } from '../constants/colors';
import useDefaultCurrency from '../hooks/api/useDefaultCurrency';
import { CurrencyCode } from '../generated/server/globalTypes';

export default function HomeScene() {
  let { navigate, setOptions } = useNavigation<StackNavProp<'Home'>>();
  let { screenSize } = useDimensions();
  let numColumns = useColumns();
  let [isSearchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  let first = numColumns * 5;

  let {
    loading: loadingCurrency,
    data: selectedCurrency,
  } = useDefaultCurrency();
  let {
    loading: loadingHomeData,
    products,
    categories,
    refetch,
    hasMore,
    isFetchingMore,
  } = useCollectionAndProductQuery(selectedCurrency, first);

  setOptions({
    headerLeft: () => <CurrencyPicker onPressCurrency={onPressCurrency} />,
  });
  let onPressCurrency = (currency: CurrencyCode) => {
    refetch('update', {
      presentmentCurrencies: [currency],
      first,
      after: null,
    });
  };
  let onItemPress = (product: Product) => {
    navigate('ProductDetails', { productHandle: product.handle });
  };
  let onSubmit = (searchKeyword: string) =>
    navigate('SearchResults', {
      searchKeyword,
    });

  let onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (distanceFromEnd > 0 && !isFetchingMore && hasMore) {
      refetch('scroll', {
        presentmentCurrencies: [selectedCurrency],
        first,
        after: products[products.length - 1].cursor || null,
      });
    }
  };

  if ((loadingHomeData || loadingCurrency || !products) && !isFetchingMore) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  let renderHeader = () => (
    <>
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

      <View>
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
        data={products}
        numColumns={numColumns}
        onItemPress={onItemPress}
        columnWrapperStyle={styles.itemWrapperStyle}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.25}
        ListFooterComponent={() => {
          return hasMore ? <ActivityIndicator /> : null;
        }}
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
});
