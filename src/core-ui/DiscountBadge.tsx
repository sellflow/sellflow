import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';

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
