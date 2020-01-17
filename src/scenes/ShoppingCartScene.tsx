import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, TextInput } from 'exoflex';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { CheckoutData as checkoutData } from '../fixtures/OrderItemData';
import { OrderItem } from '../components';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';

export default function ShoppingCartScene() {
  let subtotal = 77;
  let shippingCost = 0;
  let total = subtotal + shippingCost;
  let dimensions = useDimensions();

  let paymentData: PaymentData = { subtotal, shippingCost, total };

  let containerProductStyle = () => {
    let styleApplied;

    switch (dimensions.screenSize) {
      case ScreenSize.Small: {
        styleApplied = styles.container;
        break;
      }
      case ScreenSize.Medium: {
        styleApplied = styles.portraitTabletProductsContainer;
        break;
      }
      case ScreenSize.Large: {
        styleApplied = styles.landscapeTabletProductsContainer;
        break;
      }
    }

    return styleApplied;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={containerProductStyle()}>
          <View>
            <View style={styles.productDetailsContainer}>
              <View style={styles.orderItemContainer}>
                {checkoutData.map((item, index) => {
                  return (
                    <View key={item.variantID}>
                      {index > 0 ? (
                        <View style={styles.productSeparator} />
                      ) : null}
                      <OrderItem
                        orderItem={item}
                        containerStyle={styles.orderItem}
                        key={item.variantID}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
          {(dimensions.screenSize === ScreenSize.Medium ||
            dimensions.screenSize === ScreenSize.Small) && (
            <Payment data={paymentData} />
          )}
        </View>
      </ScrollView>
      {dimensions.screenSize === ScreenSize.Large && (
        <Payment data={paymentData} />
      )}
    </SafeAreaView>
  );
}

type PaymentProps = {
  data: PaymentData;
};
type PaymentData = {
  subtotal: number;
  shippingCost: number;
  total: number;
};

function Payment(props: PaymentProps) {
  let { shippingCost, total, subtotal } = props.data;
  let dimensions = useDimensions();
  let containerCheckoutStyle = () => {
    let styleApplied;
    if (dimensions.screenSize === ScreenSize.Large) {
      styleApplied = styles.tabletLandscapeCheckoutContainer;
    }
    return styleApplied;
  };

  return (
    <View style={containerCheckoutStyle()}>
      <View style={styles.voucherCodeContainer}>
        <View>
          <Text
            style={[styles.greyText, styles.smallText, { marginBottom: 12 }]}
          >
            {t('Voucher code or giftcard')}
          </Text>
          <View>
            <View style={styles.voucherInputButtonContainer}>
              <TextInput
                containerStyle={styles.voucherTextInputContainer}
                autoCapitalize="none"
              />
              <Button contentStyle={styles.addBotton}>
                <Text weight="bold" style={styles.buttonText}>
                  {t('Add')}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.paymentDetailsContainer}>
          <Surface containerStyle={styles.surfacePaymentDetails}>
            <View style={styles.innerPaymentDetailsContainer}>
              <Text style={[styles.mediumText, { marginBottom: 6 }]}>
                {t('Subtotal')}
              </Text>
              <Text style={styles.mediumText}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.innerPaymentDetailsContainer}>
              <Text style={[styles.mediumText, { marginBottom: 6 }]}>
                {t('Shipping')}
              </Text>
              <Text style={[styles.mediumText, { textTransform: 'uppercase' }]}>
                -{formatCurrency(shippingCost)}
              </Text>
            </View>
            <View
              style={[
                styles.innerPaymentDetailsContainer,
                {
                  borderTopWidth: 1,
                  borderColor: COLORS.lightGrey,
                },
              ]}
            >
              <Text style={[styles.mediumText, { marginBottom: 6 }]}>
                {t('Total')}
              </Text>
              <Text weight="bold" style={styles.mediumText}>
                {formatCurrency(total)}
              </Text>
            </View>
          </Surface>
        </View>
      </View>
      <Button style={styles.checkout}>
        <Text weight="bold" style={styles.buttonText}>
          {t('Checkout')}
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  scrollContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  tabletLandscapeCheckoutContainer: {
    paddingTop: 14,
    paddingRight: 36,
    paddingLeft: 12,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'column',
    flexGrow: 1,
  },
  portraitTabletProductsContainer: {
    paddingHorizontal: 36,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  landscapeTabletProductsContainer: {
    paddingLeft: 36,
    paddingRight: 12,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  voucherCodeContainer: {
    padding: 12,
    borderWidth: 0.5,
    borderColor: COLORS.grey,
    marginVertical: 2,
  },
  voucherTextInputContainer: {
    flexGrow: 2,
    height: 48,
    borderRadius: 0,
    borderColor: COLORS.grey,
    borderWidth: 0.5,
    marginRight: 24,
  },
  voucherInputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productDetailsContainer: {
    flexDirection: 'column',
    marginVertical: 2,
  },
  orderItemContainer: {
    marginVertical: 7,
  },
  paymentDetailsContainer: {
    marginVertical: 2,
  },
  innerPaymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  surfacePaymentDetails: {
    paddingHorizontal: 15,
  },
  orderItem: {
    paddingVertical: 7,
  },
  greyText: {
    color: COLORS.grey,
  },
  smallText: {
    fontSize: FONT_SIZE.small,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  checkout: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 0,
    justifyContent: 'center',
  },
  addBotton: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 0,
    justifyContent: 'center',
    maxWidth: 88,
    minWidth: 88,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  productSeparator: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey,
  },
});
