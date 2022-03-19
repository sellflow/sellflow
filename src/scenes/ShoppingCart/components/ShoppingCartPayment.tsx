import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PaymentDetails } from '../../../components';
import { COLORS } from '../../../constants/colors';
import {
  defaultButton,
  defaultButtonLabel,
  outlinedTextInput,
} from '../../../constants/theme';
import { Button, Text, TextInput } from '../../../core-ui';
import useCurrencyFormatter from '../../../hooks/api/useCurrencyFormatter';
import { PaymentData, PaymentDetailsProps } from '../../../types/types';

type Props = {
  data: PaymentData;
  voucherCode: string;
  onVoucherCodeChange: (value: string) => void;
  onAddCode: () => void;
  applyLoading: boolean;
  isVoucherCodeValid: boolean;
};

export default function ShoppingCartPayment(props: Props) {
  let {
    data: { total, subtotal },
    onVoucherCodeChange,
    voucherCode,
    onAddCode,
    applyLoading,
    isVoucherCodeValid,
  } = props;
  let formatCurrency = useCurrencyFormatter();
  let paymentData: Array<PaymentDetailsProps> = [
    {
      name: t('Subtotal'),
      value: formatCurrency(subtotal),
    },
    {
      name: t('Discount'),
      value: formatCurrency(subtotal - total),
    },
    {
      name: t('Total'),
      value: formatCurrency(total),
    },
  ];
  return (
    <>
      <View style={styles.voucherCodeContainer}>
        <Text style={styles.opacity}>{t('Voucher code or giftcard')}</Text>
        <View style={styles.voucherInputButtonContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              autoCapitalize="none"
              returnKeyType="done"
              value={voucherCode}
              onChangeText={onVoucherCodeChange}
              containerStyle={[
                outlinedTextInput,
                styles.voucherTextInputContainer,
              ]}
              style={outlinedTextInput}
              errorMessage={
                !isVoucherCodeValid
                  ? t('Voucher code does not exist')
                  : undefined
              }
              errorMessageStyle={styles.errorMessage}
            />
          </View>
          <Button
            style={defaultButton}
            disabled={applyLoading}
            contentStyle={styles.addButton}
            labelStyle={defaultButtonLabel}
            onPress={onAddCode}
          >
            {t('Add')}
          </Button>
        </View>
      </View>
      <PaymentDetails
        data={paymentData}
        containerStyle={styles.surfacePaymentDetails}
      />
    </>
  );
}

const styles = StyleSheet.create({
  voucherCodeContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  voucherTextInputContainer: {
    flexGrow: 1,
    marginRight: 16,
  },
  voucherInputButtonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputContainer: { flex: 1 },
  surfacePaymentDetails: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 15,
  },
  addButton: {
    maxWidth: 88,
    minWidth: 88,
  },
  opacity: {
    opacity: 0.6,
  },
  errorMessage: {
    padding: 0,
    marginTop: 4,
  },
});
