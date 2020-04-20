import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text, TextInput } from 'exoflex';

import { COLORS } from '../constants/colors';
import { valueBetweenZeroToMax } from '../helpers/valueBetweenZeroToMax';
import useCurrencyFormatter from '../hooks/api/useCurrencyFormatter';
import { FONT_SIZE } from '../constants/fonts';
import { OrderItem as OrderItemType } from '../types/types';
import { outlinedTextInput } from '../constants/theme';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  orderItem: OrderItemType;
  cardType: 'checkout' | 'order';
};

export default function OrderItem(props: Props) {
  let {
    title,
    variant,
    image,
    priceAfterDiscount,
    onRemovePress,
    variantID,
    originalPrice,
    quantityAvailable,
    onChangeQuantity,
  } = props.orderItem;
  let { containerStyle, cardType } = props;
  let [quantity, setQuantity] = useState<number>(props.orderItem.quantity);
  let [itemPrice] = useState<number>(originalPrice);
  let formatCurrency = useCurrencyFormatter();
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text weight="normal" style={styles.fontSmall}>
          {title} {cardType === 'order' ? ` × ${quantity}` : ''}
        </Text>
        <View style={styles.price}>
          <View>
            <Text weight="bold" style={styles.fontMedium}>
              {priceAfterDiscount && priceAfterDiscount > 0
                ? formatCurrency(priceAfterDiscount * quantity)
                : formatCurrency(itemPrice * quantity)}
            </Text>
          </View>
          {priceAfterDiscount && priceAfterDiscount > 0 ? (
            <View style={styles.section2}>
              <Text
                weight="normal"
                style={[styles.discountText, styles.fontMedium]}
              >
                {formatCurrency(itemPrice * quantity)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.greyText, styles.fontSmall]}>{variant}</Text>
      </View>

      {cardType === 'checkout' ? (
        <View style={styles.amountContainer}>
          <TextInput
            keyboardType="number-pad"
            returnKeyType="done"
            value={quantity.toString()}
            onBlur={() => {
              if (quantity <= 0) {
                setQuantity(1);
              }
              onChangeQuantity
                ? onChangeQuantity(variantID, quantity <= 0 ? 1 : quantity)
                : null;
            }}
            onChangeText={(value) => {
              setQuantity(
                valueBetweenZeroToMax(parseInt(value, 10), quantityAvailable),
              );
            }}
            containerStyle={[outlinedTextInput, styles.amountInputWidth]}
            style={[outlinedTextInput, quantity < 999 && styles.amount]}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.remove}
            onPress={() => {
              onRemovePress ? onRemovePress(variantID) : null;
            }}
          >
            <Text style={styles.redText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 80,
  },
  image: {
    width: 72,
    height: 72,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end',
    maxWidth: 70,
  },
  amountInputWidth: {
    width: 50,
    paddingHorizontal: 5,
  },
  amount: {
    textAlign: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    color: COLORS.grey,
    textDecorationLine: 'line-through',
  },
  remove: {
    alignSelf: 'flex-end',
    bottom: 0,
    position: 'absolute',
  },
  greyText: {
    color: COLORS.grey,
  },
  redText: {
    color: COLORS.red,
  },
  section2: {
    marginLeft: 8,
  },
  fontSmall: {
    fontSize: FONT_SIZE.small,
  },
  fontMedium: {
    fontSize: FONT_SIZE.medium,
  },
});
