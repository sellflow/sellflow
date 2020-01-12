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

type Props = {
  order: OrderRecord;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: (order: OrderRecord) => void;
};

export default function OrderHistoryItem(props: Props) {
  let { order, containerStyle, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onPress(order)}
    >
      <Text weight="medium" style={styles.orderID}>
        {t('Order {orderID}', { orderID: order.orderID })}
      </Text>
      <View style={styles.textStyle}>
        <Text>
          {t('Order Time {orderTime}', { orderTime: order.orderTime })}
        </Text>
      </View>
      <View style={styles.textStyle}>
        <Text>
          {t('Total Payment {totalPayment}', {
            totalPayment: order.totalPayment,
          })}
        </Text>
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
