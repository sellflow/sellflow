import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../general/constants/colors';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  discountNumber: number;
};

export default function DiscountBadge(props: Props) {
  let { containerStyle, textStyle, discountNumber, ...otherProps } = props;

  return (
    <View style={[styles.discountContainer, containerStyle]}>
      <Text
        weight="medium"
        style={[styles.discount, textStyle]}
        {...otherProps}
      >
        {discountNumber}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  discountContainer: {
    minWidth: 34,
    maxWidth: 46,
    minHeight: 28,
    maxHeight: 36,
    padding: 6,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discount: {
    color: COLORS.white,
  },
});
