import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
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

let paymentData: PaymentData = {
  subtotal: 77,
  shippingCost: 0,
  total: 77,
};

export default function ShoppingCartScene() {
  let { screenSize } = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'ShoppingCart'>>();

  let renderCartView = () => (
    <View style={styles.cartContainer}>
      <View style={styles.orderItemContainer}>
        {checkoutData.map((item, index) => (
          <View key={item.variantID}>
            {index > 0 ? <View style={styles.productSeparator} /> : null}
            <OrderItem
              orderItem={item}
              containerStyle={styles.orderItem}
              key={item.variantID}
            />
          </View>
        ))}
      </View>
    </View>
  );
  let renderPaymentView = () => <Payment data={paymentData} />;
  let renderButton = () => (
    <Button
      style={defaultButton}
      labelStyle={defaultButtonLabel}
      onPress={() => {
        navigate('Checkout');
      }}
    >
      {t('Checkout')}
    </Button>
  );
  return screenSize === ScreenSize.Large ? (
    <View style={styles.horizontalLayout}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {renderCartView()}
      </ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
          {renderPaymentView()}
          {renderButton()}
        </View>
      </SafeAreaView>
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          screenSize === ScreenSize.Small
            ? styles.scrollContentSmall
            : styles.scrollContentMedium
        }
      >
        {renderCartView()}
        {renderPaymentView()}
      </ScrollView>
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        {renderButton()}
      </View>
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
  return (
    <>
      <View style={styles.voucherCodeContainer}>
        <Text style={styles.textLabel}>{t('Voucher code or giftcard')}</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  horizontalLayout: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'stretch',
  },
  scrollContentSmall: {
    paddingHorizontal: 24,
  },
  scrollContentMedium: {
    paddingHorizontal: 36,
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
  cartContainer: {
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
  textLabel: {
    color: COLORS.grey,
    fontSize: FONT_SIZE.small,
    marginBottom: 12,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  paymentDetailLabel: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  addButton: {
    maxWidth: 88,
    minWidth: 88,
  },
  productSeparator: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey,
  },
});
