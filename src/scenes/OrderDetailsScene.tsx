import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text } from 'exoflex';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import formatDateTime from '../helpers/formatDateTime';
import { OrderItem, PaymentDetails } from '../components';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { StackRouteProp } from '../types/Navigation';
import useCurrencyFormatter from '../hooks/api/useCurrencyFormatter';
import { PaymentDetailsProps } from '../types/types';

export default function OrderDetailsScene() {
  let route = useRoute<StackRouteProp<'OrderDetails'>>();
  let { order } = route.params;
  let { screenSize } = useDimensions();
  let {
    address,
    lineItems,
    orderNumber,
    orderTime,
    totalPayment,
    shippingPrice,
    subtotalPayment,
  } = order;

  let { address1, city, country, name, phone, province, zip } = address;
  let formatCurrency = useCurrencyFormatter();

  let paymentData: Array<PaymentDetailsProps> = [
    {
      name: t('Subtotal'),
      value: formatCurrency(subtotalPayment),
    },
    {
      name: t('Shipping'),
      value: shippingPrice === 0 ? t('Free') : formatCurrency(shippingPrice),
    },
    {
      name: t('Total'),
      value: formatCurrency(totalPayment),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={
          screenSize === ScreenSize.Small
            ? styles.container
            : styles.containerWide
        }
      >
        <View style={styles.orderInfoSection}>
          <Surface containerStyle={styles.surfaceOrderContainer}>
            <Text weight="medium" style={styles.mediumText}>
              {t('Order No.')}
            </Text>
            <Text style={styles.mediumText}>{orderNumber}</Text>
          </Surface>
          <Surface containerStyle={styles.surfaceOrderContainer}>
            <Text weight="medium" style={styles.mediumText}>
              {t('Ordered')}
            </Text>
            <Text style={styles.mediumText}>{formatDateTime(orderTime)}</Text>
          </Surface>
        </View>
        <View style={styles.productDetailsContainer}>
          <Text style={styles.greyText}>{t('Product Details')}</Text>
          <View style={styles.orderItemContainer}>
            {lineItems.map((item) => (
              <OrderItem
                cardType="order"
                orderItem={item}
                containerStyle={styles.orderItem}
                key={item.variantID}
              />
            ))}
          </View>
        </View>
        <View style={styles.shippingAddressContainer}>
          <Text style={styles.greyText}>{t('Shipping Address')}</Text>
          <Surface containerStyle={styles.surfaceShippingContainer}>
            <Text style={[styles.mediumText, styles.marginBottom]}>{name}</Text>
            <Text style={styles.greyText}>{address1}</Text>
            <Text style={styles.greyText}>{`${city}, ${province} ${zip}`}</Text>
            <Text style={styles.greyText}>{country}</Text>
            <Text style={styles.greyText}>
              {t('Phone: ')}
              {phone}
            </Text>
          </Surface>
        </View>
        <Text style={styles.greyText}>{t('Payment Details')}</Text>
        <PaymentDetails
          data={paymentData}
          containerStyle={styles.surfacePaymentDetails}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    paddingBottom: 24,
  },
  containerWide: {
    marginHorizontal: 36,
    paddingBottom: 24,
  },
  orderInfoSection: {
    marginVertical: 16,
  },
  shippingAddressContainer: {
    marginBottom: 16,
  },
  productDetailsContainer: {
    marginBottom: 9,
  },
  orderItemContainer: {
    marginTop: 11,
  },
  surfaceOrderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  surfaceShippingContainer: {
    marginTop: 12,
    padding: 12,
  },
  surfacePaymentDetails: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  orderItem: {
    paddingVertical: 7,
  },
  greyText: {
    opacity: 0.6,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  marginBottom: {
    marginBottom: 6,
  },
});
