import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageBackground,
} from 'react-native';
import { Text } from 'exoflex';

import { DiscountBadge } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { priceAfterDiscount } from '../helpers/priceAfterDiscount';
import useCurrencyFormatter from '../hooks/api/useCurrencyFormatter';
import { Product } from '../types/types';

type Props = {
  product: Product;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function ProductItem(props: Props) {
  let { product, onPress, containerStyle, imageStyle } = props;
  let { title, images, price, discount, availableForSale } = product;
  let afterDiscount = priceAfterDiscount(price, discount || 0);
  let formatCurrency = useCurrencyFormatter();

  let renderImage = () => {
    return availableForSale ? (
      <View style={styles.imageContainer}>
        <Image style={[styles.image, imageStyle]} source={{ uri: images[0] }} />
      </View>
    ) : (
      <View style={styles.imageContainer}>
        <ImageBackground
          style={[styles.image, imageStyle]}
          source={{ uri: images[0] }}
        >
          <View style={styles.oosBackground}>
            <Text style={styles.oosText} weight="medium">
              {t('Out of Stock')}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      {renderImage()}
      {discount && discount > 0 ? (
        <DiscountBadge value={discount} containerStyle={styles.discountBox} />
      ) : null}
      <Text numberOfLines={1} style={styles.nameText}>
        {title}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText} weight="bold">
          {discount && discount > 0
            ? formatCurrency(afterDiscount)
            : formatCurrency(price)}
        </Text>
        {discount && discount > 0 ? (
          <Text style={styles.discountedPrice}>{formatCurrency(price)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 0.85,
  },
  imageContainer: {
    marginBottom: 12,
  },
  discountBox: {
    position: 'absolute',
    top: 14,
    right: 12,
  },
  nameText: {
    fontSize: FONT_SIZE.small,
    marginBottom: 6,
  },
  priceText: {
    marginRight: 8,
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  discountedPrice: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.priceGrey,
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oosText: {
    color: COLORS.white,
  },
  oosBackground: {
    backgroundColor: COLORS.black,
    opacity: 0.6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
