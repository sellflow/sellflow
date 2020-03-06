import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text, Button } from 'exoflex';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import formatDateTime from '../helpers/formatDateTime';
import { OrderItem } from '../components';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { StackRouteProp } from '../types/Navigation';
import formatCurrency from '../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../constants/theme';

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
        <Surface containerStyle={styles.surfacePaymentDetails}>
          <View style={styles.innerPaymentDetailsContainer}>
            <Text style={[styles.mediumText, styles.marginBottom]}>
              {t('Subtotal')}
            </Text>
            <Text style={styles.mediumText}>
              {formatCurrency(subtotalPayment)}
            </Text>
          </View>
          <View style={styles.innerPaymentDetailsContainer}>
            <Text style={[styles.mediumText, styles.marginBottom]}>
              {t('Shipping')}
            </Text>
            <Text style={[styles.mediumText, { textTransform: 'uppercase' }]}>
              {shippingPrice === 0 ? t('Free') : formatCurrency(shippingPrice)}
            </Text>
          </View>
          <View style={[styles.innerPaymentDetailsContainer, styles.border]}>
            <Text style={styles.mediumText}>{t('Total')}</Text>
            <Text weight="medium" style={styles.mediumText}>
              {formatCurrency(totalPayment)}
            </Text>
          </View>
        </Surface>
      </ScrollView>
      <Button
        onPress={() => {}}
        style={[defaultButton, styles.bottomButton]}
        labelStyle={defaultButtonLabel}
      >
        {t('Track Order')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  containerWide: {
    marginHorizontal: 36,
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
  innerPaymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  bottomButton: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 10,
  },
  marginBottom: {
    marginBottom: 6,
  },
});
