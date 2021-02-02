import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { Button, IconButton } from 'exoflex';
import { useQuery } from '@apollo/react-hooks';

import {
  useAddItemToWishlist,
  useRemoveItemFromWishlist,
} from '../../../hooks/api/useWishlist';
import { COLORS } from '../../../constants/colors';
import { defaultButton, defaultButtonLabel } from '../../../constants/theme';
import { GetShop } from '../../../generated/server/GetShop';
import { GET_SHOP } from '../../../graphql/server/shop';
import { ProductDetails } from '../../../types/types';

type Props = {
  product: ProductDetails;
  isLoading: boolean;
  isWishlistActive: boolean;
  onAddToCartPress: () => void;
  onWishlistPress: (value: boolean) => void;
  isButtonDisabled: boolean;
};

export default function BottomActionBar(props: Props) {
  let { addToWishlist } = useAddItemToWishlist();
  let { removeFromWishlist } = useRemoveItemFromWishlist();
  let {
    isWishlistActive,
    onWishlistPress,
    onAddToCartPress,
    product,
    isLoading,
    isButtonDisabled,
  } = props;

  let { data: shopData } = useQuery<GetShop>(GET_SHOP);
  let shareMessage = shopData
    ? t('Check out this product from {shopName}', {
        shopName: shopData.shop.name,
      })
    : t('Check out this product');

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);

    if (isWishlistActive === false) {
      addToWishlist({ variables: { product } });
    } else {
      removeFromWishlist({ variables: { productHandle: product.handle } });
    }
  };

  let onShare = () => {
    Share.share({
      message: `${shareMessage}: ${product.title} ${product.url}`,
    });
  };

  let buttonLabel = () => {
    if (isLoading) {
      return null;
    }
    if (!product.id) {
      return t('Unavailable');
    }
    if (product.availableForSale) {
      return t('Add to Cart');
    }
    return t('Out of Stock');
  };

  let addButtonAction = !isLoading ? onAddToCartPress : () => {};

  return (
    <View style={styles.bottomIconContainer}>
      <IconButton
        icon="share-variant"
        color={COLORS.primaryColor}
        onPress={onShare}
        style={styles.icon}
      />
      {isWishlistActive ? (
        <IconButton
          icon="heart"
          color={COLORS.wishlist}
          onPress={onPressWishlist}
          style={styles.icon}
        />
      ) : (
        <IconButton
          icon="heart-outline"
          onPress={onPressWishlist}
          style={styles.icon}
        />
      )}
      <Button
        style={[
          defaultButton,
          styles.flex,
          isButtonDisabled && styles.disabledButton,
        ]}
        labelStyle={[
          defaultButtonLabel,
          isButtonDisabled && styles.disabledLabel,
        ]}
        disabled={isButtonDisabled}
        loading={isLoading}
        onPress={addButtonAction}
      >
        {buttonLabel()}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bottomIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 14,
  },
  disabledButton: {
    backgroundColor: COLORS.black,
    opacity: 0.2,
  },
  disabledLabel: {
    color: COLORS.white,
  },
});
