import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ErrorPage, ProductList } from '../components';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { Text } from '../core-ui';
import { useColumns } from '../helpers/columns';
import { useGetWishlistData } from '../hooks/api/useWishlist';
import { StackNavProp } from '../types/Navigation';

export default function WishlistScene() {
  let { navigate } = useNavigation<StackNavProp<'Wishlist'>>();
  let numColumns = useColumns();

  let { data: wishlistData, error, refetch } = useGetWishlistData();

  if (error && !wishlistData?.wishlist.length) {
    return <ErrorPage onRetry={refetch} />;
  }

  if (!wishlistData || wishlistData.wishlist.length === 0) {
    return (
      <View style={styles.emptyWishlist}>
        <Text style={styles.emptyWishlistText}>{t('No products yet.')}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.count}>
          {t('Showing {count} item(s)', {
            count: wishlistData.wishlist.length,
          })}
        </Text>
        <ProductList
          data={wishlistData.wishlist}
          numColumns={numColumns}
          contentContainerStyle={styles.contentContainer}
          onItemPress={(product) =>
            navigate('ProductDetails', { productHandle: product.handle })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  emptyWishlist: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  emptyWishlistText: {
    fontSize: FONT_SIZE.medium,
  },
  count: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  contentContainer: {
    marginBottom: 16,
  },
});
