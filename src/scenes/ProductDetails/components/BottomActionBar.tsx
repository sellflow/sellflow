import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton } from 'exoflex';

import {
  useAddItemToWishlist,
  useRemoveItemFromWishlist,
} from '../../../hooks/api/useWishlist';
import { COLORS } from '../../../constants/colors';
import { defaultButton, defaultButtonLabel } from '../../../constants/theme';
import { Product } from '../../../types/types';

type Props = {
  product: Product;
  isLoading: boolean;
  isWishlistActive: boolean;
  onAddToCartPress: () => void;
  onWishlistPress: (value: boolean) => void;
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
  } = props;

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);

    if (isWishlistActive === false) {
      addToWishlist({ variables: { product } });
    } else {
      removeFromWishlist({ variables: { productHandle: product.handle } });
    }
  };

  return (
    <View style={styles.bottomIconContainer}>
      <IconButton
        icon="share-variant"
        color={COLORS.primaryColor}
        onPress={() => {}}
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
        style={[defaultButton, styles.flex]}
        labelStyle={defaultButtonLabel}
        disabled={isLoading}
        loading={isLoading}
        onPress={() => {
          onAddToCartPress();
        }}
      >
        {t('Add to Cart')}
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
});
