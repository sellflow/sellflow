import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { RadioButton, Text } from 'exoflex';

import PaymentRadioButton from './PaymentRadioButton';
import { visa, masterCard } from '../../../../assets/images';
import { COLORS } from '../../../constants/colors';
import CreditCardForm from './CreditCardForm';
import { Payment } from '../../../types/types';

type CreditCard = {
  cardNumber: { number: string; isValid: boolean };
  name: string;
  expirationDate: { date: string; isValid: boolean };
  cvv: string;
};

type Props = {
  acceptedTypes: Array<Payment>;
  selectedType: string;
  onSelect: (value: string) => void;
  creditCard: CreditCard;
  onCardValueChange: (value: CreditCard) => void;
};

export default function PaymentRadioGroup(props: Props) {
  let {
    selectedType,
    onSelect,
    creditCard,
    onCardValueChange,
    acceptedTypes,
  } = props;

  let radioButtonStyle = (id: string) => [
    styles.radioButton,
    selectedType === id ? styles.active : styles.inactive,
  ];

  let CreditCardLogo = () => (
    <View style={styles.creditCardLogoContainer}>
      <Image source={visa} style={styles.creditCardLogo} />
      <Image source={masterCard} style={styles.creditCardLogo} />
      <Text style={styles.opacity}>{t('and more')}</Text>
    </View>
  );

  return (
    <RadioButton.Group value={selectedType} onValueChange={onSelect}>
      {acceptedTypes.map((payment) => {
        return (
          <PaymentRadioButton
            key={payment.id}
            value={payment.id}
            label={
              <View style={styles.radioButtonLabel}>
                <Text>{payment.name}</Text>
                {payment.id === 'CREDIT_CARD' && <CreditCardLogo />}
              </View>
            }
            isSelected={selectedType === payment.id}
            onSelect={onSelect}
            style={radioButtonStyle(payment.id)}
          >
            {payment.id === 'CREDIT_CARD' && (
              <CreditCardForm
                creditCard={creditCard}
                onCardValueChange={onCardValueChange}
              />
            )}
          </PaymentRadioButton>
        );
      })}
    </RadioButton.Group>
  );
}

const styles = StyleSheet.create({
  opacity: {
    opacity: 0.6,
  },
  radioButton: {
    marginTop: 12,
    borderWidth: 1,
  },
  inactive: {
    borderColor: COLORS.lightGrey,
  },
  active: {
    borderColor: COLORS.primaryColor,
  },
  creditCardLogo: {
    width: 30,
    height: 14,
    resizeMode: 'contain',
  },
  radioButtonLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  creditCardLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
});
