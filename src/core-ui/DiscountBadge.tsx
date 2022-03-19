import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../constants/colors';

import Text from './Text';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  value: number;
};

export default function DiscountBadge(props: Props) {
  let { containerStyle, textStyle, value, ...otherProps } = props;
  let discount = Math.round(value);
  return (
    <View style={[styles.discountContainer, containerStyle]}>
      <Text
        weight="medium"
        style={[styles.discount, textStyle]}
        {...otherProps}
      >
        {t('{discount}% off', { discount })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  discountContainer: {
    padding: 6,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discount: {
    color: COLORS.white,
  },
});
