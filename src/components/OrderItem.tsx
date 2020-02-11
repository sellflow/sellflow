import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { valueBetweenZeroToMax } from '../helpers/valueBetweenZeroToMax';
import formatCurrency from '../helpers/formatCurrency';
import { FONT_SIZE } from '../constants/fonts';
import { OrderItem as OrderItemType } from '../types/types';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  orderItem: OrderItemType;
};

export default function OrderItem(props: Props) {
  let {
    itemName,
    variant,
    imageURL,
    priceAfterDiscount,
    cardType,
    onRemovePress,
    variantID,
    onChangeQuantity,
  } = props.orderItem;
  let { containerStyle } = props;
  let [quantity, setQuantity] = useState(props.orderItem.quantity);
  let [itemPrice] = useState(props.orderItem.itemPrice);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imageURL,
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text weight="normal" style={styles.fontSmall}>
          {itemName} {cardType === 'order' ? ` × ${quantity}` : ''}
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
            style={styles.amountInput}
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
              setQuantity(valueBetweenZeroToMax(parseInt(value, 10), 999));
            }}
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
  amountInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: COLORS.white,
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
