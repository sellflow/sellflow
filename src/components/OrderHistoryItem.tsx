import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { OrderRecord } from '../types/types';
import formatDateTime from '../helpers/formatDateTime';
import useCurrencyFormatter from '../hooks/api/useCurrencyFormatter';

type Props = {
  order: OrderRecord;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export default function OrderHistoryItem(props: Props) {
  let { order, containerStyle, onPress } = props;
  let formatCurrency = useCurrencyFormatter();
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Text weight="medium" style={styles.orderNumber}>
        {t('Order {orderID}', { orderID: order.orderNumber })}
      </Text>
      <View style={styles.textStyle}>
        <Text>{t('Ordered')}</Text>
        <Text>{formatDateTime(order.orderTime)}</Text>
      </View>
      <View style={styles.textStyle}>
        <Text>{t('Total')}</Text>
        <Text>{formatCurrency(order.totalPayment)}</Text>
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
    backgroundColor: COLORS.white,
  },
  orderNumber: {
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
