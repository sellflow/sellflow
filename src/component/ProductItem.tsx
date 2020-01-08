import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Text } from 'exoflex';

import { DiscountBadge } from '../core-ui';
import { FONT_SIZE } from '../general/constants/fonts';
import { COLORS } from '../general/constants/colors';
import { priceAfterDiscount } from '../helpers/priceAfterDiscount';

type Props = {
  uri: string;
  name: string;
  price: number;
  onPress: () => void;
  discount?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function ProductItem(props: Props) {
  let {
    uri,
    name,
    price,
    onPress,
    discount,
    containerStyle,
    imageStyle,
  } = props;
  let afterDiscount = priceAfterDiscount(price, discount ? discount : 0);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Image style={[styles.image, imageStyle]} source={{ uri }} />
      {discount && (
        <DiscountBadge
          value={discount.toString()}
          containerStyle={styles.discountBox}
        />
      )}
      <Text numberOfLines={1} style={styles.nameText}>
        {name}
      </Text>
      {discount ? (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText} weight="bold">
            ${afterDiscount}
          </Text>
          <Text style={styles.discountedPrice}>${price}</Text>
        </View>
      ) : (
        <Text style={styles.priceText} weight="bold">
          ${price}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '75%',
  },
  discountBox: {
    position: 'absolute',
    top: 14,
    right: 0,
  },
  nameText: {
    fontSize: FONT_SIZE.small,
  },
  priceText: {
    marginRight: 8,
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  discountedPrice: {
    fontSize: FONT_SIZE.large,
    color: COLORS.priceGrey,
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    flexDirection: 'row',
  },
});
