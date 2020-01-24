import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { CheckoutData as checkoutData } from '../fixtures/OrderItemData';
import { OrderItem } from '../components';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';

export default function ShoppingCartScene() {
  let subtotal = 77;
  let shippingCost = 0;
  let total = subtotal + shippingCost;
  let dimensions = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'ShoppingCart'>>();

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

  let renderPaymentView = () => (
    <Payment
      data={paymentData}
      onSubmit={() => {
        navigate('Checkout');
      }}
    />
  );
  return (
    <View style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollContainer}
        nestedScrollEnabled={true}
      >
        <View style={containerProductStyle()}>
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
          {(dimensions.screenSize === ScreenSize.Medium ||
            dimensions.screenSize === ScreenSize.Small) &&
            renderPaymentView()}
        </View>
      </ScrollView>
      {dimensions.screenSize === ScreenSize.Large && renderPaymentView()}
    </View>
  );
}

type PaymentProps = {
  data: PaymentData;
  onSubmit: () => void;
};
type PaymentData = {
  subtotal: number;
  shippingCost: number;
  total: number;
};

function Payment(props: PaymentProps) {
  let { onSubmit } = props;
  let { shippingCost, total, subtotal } = props.data;
  let dimensions = useDimensions();
  let containerCheckoutStyle = () => {
    if (dimensions.screenSize === ScreenSize.Large) {
      return styles.tabletLandscapeCheckoutContainer;
    }
  };

  return (
    <View style={containerCheckoutStyle()}>
      <View style={styles.voucherCodeContainer}>
        <Text style={[styles.greyText, styles.smallText, styles.margin]}>
          {t('Voucher code or giftcard')}
        </Text>
        <View style={styles.voucherInputButtonContainer}>
          <TextInput
            containerStyle={styles.voucherTextInputContainer}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Button
            style={defaultButton}
            contentStyle={styles.addButton}
            labelStyle={defaultButtonLabel}
          >
            {t('Add')}
          </Button>
        </View>
      </View>
      <Surface containerStyle={styles.surfacePaymentDetails}>
        <View style={styles.innerPaymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.innerPaymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Shipping')}</Text>
          <Text style={styles.mediumText}>-{formatCurrency(shippingCost)}</Text>
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
          <Text style={styles.paymentDetailLabel}>{t('Total')}</Text>
          <Text weight="bold" style={styles.mediumText}>
            {formatCurrency(total)}
          </Text>
        </View>
      </Surface>
      <Button
        style={[defaultButton, styles.checkout]}
        labelStyle={defaultButtonLabel}
        onPress={onSubmit}
      >
        {t('Checkout')}
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
  innerPaymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  surfacePaymentDetails: {
    marginTop: 16,
    marginBottom: 24,
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
  paymentDetailLabel: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  checkout: {
    marginBottom: 14,
  },
  addButton: {
    maxWidth: 88,
    minWidth: 88,
  },
  productSeparator: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey,
  },
  margin: {
    marginBottom: 12,
  },
});
