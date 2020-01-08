import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../general/constants/colors';
import { FONT_SIZE } from '../general/constants/fonts';
import { OrderRecord } from '../types/types';

type Props = {
  order: OrderRecord;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function OrderHistoryItem(props: Props) {
  let { order, containerStyle } = props;
  let onPress = () => {
    // TODO: Navigate to OrderDetails scene
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Text weight="medium" style={styles.orderID}>
        {t('Order {orderID}', { orderID: order.orderID })}
      </Text>
      <View style={styles.textStyle}>
        <Text>{t('Order Time')}</Text>
        <Text>{t('{orderTime}', { orderTime: order.orderTime })}</Text>
      </View>
      <View style={styles.textStyle}>
        <Text>{t('Total Payment')}</Text>
        <Text>{t('{totalPayment}', { totalPayment: order.totalPayment })}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  orderID: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
    marginBottom: 8,
  },
  textStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
