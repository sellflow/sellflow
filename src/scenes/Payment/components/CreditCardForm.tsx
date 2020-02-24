import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput } from 'exoflex';
import valid from 'card-validator';

import {
  INVALID_CARD_NUMBER_MESSAGE,
  INVALID_EXPIRATION_DATE_MESSAGE,
} from '../../../helpers/validation';
import formatCardNumber from '../../../helpers/formatCardNumber';
import { cleanNumber, limitLength } from '../../../helpers/utilities';
import { COLORS } from '../../../constants/colors';
import formatExpiryDate from '../../../helpers/formatExpiryDate';
import { visa, masterCard, discover, amex } from '../../../../assets/images';

type CreditCard = {
  cardNumber: { number: string; isValid: boolean };
  name: string;
  expirationDate: { date: string; isValid: boolean };
  cvv: string;
};

type Props = {
  creditCard: CreditCard;
  onCardValueChange: (value: CreditCard) => void;
};

export default function CreditCardForm(props: Props) {
  let { creditCard, onCardValueChange } = props;
  let [cardType, setCardType] = useState('');
  let [isCardNumberFocus, setIsCardNumberFocus] = useState(false);

  let getBorderColor = () => {
    if (creditCard && !creditCard.cardNumber.isValid) {
      return styles.error;
    }
    if (isCardNumberFocus) {
      return styles.focus;
    }
    return styles.blur;
  };

  let getCardLogo = (cardType: string) => {
    if (cardType === 'visa') {
      return visa;
    }
    if (cardType === 'mastercard') {
      return masterCard;
    }
    if (cardType === 'american-express') {
      return amex;
    }
    if (cardType === 'discover') {
      return discover;
    }
  };

  return (
    <View style={styles.creditCardForm}>
      <View
        style={[
          styles.cardNumberContainer,
          getBorderColor(),
          {
            marginBottom: !creditCard.cardNumber.isValid ? 20 : 0,
          },
        ]}
      >
        <View style={styles.flex}>
          <TextInput
            mode="flat"
            keyboardType="number-pad"
            label={t('Card Number')}
            value={creditCard.cardNumber.number}
            onChangeText={(cardNumber) => {
              let { card, isPotentiallyValid } = valid.number(
                cleanNumber(cardNumber),
              );

              onCardValueChange({
                ...creditCard,
                cardNumber: {
                  number: formatCardNumber(cardNumber, card),
                  isValid: isPotentiallyValid,
                },
              });
              setCardType(card ? card.type : '');
            }}
            errorMessage={
              !creditCard.cardNumber.isValid
                ? INVALID_CARD_NUMBER_MESSAGE
                : undefined
            }
            errorMessageStyle={styles.cardNumberErrorStyle}
            onFocus={() => setIsCardNumberFocus(true)}
            onBlur={() => {
              setIsCardNumberFocus(false);
              let { isValid } = valid.number(creditCard.cardNumber.number);
              onCardValueChange({
                ...creditCard,
                cardNumber: {
                  ...creditCard.cardNumber,
                  isValid,
                },
              });
            }}
            containerStyle={styles.cardNumberTextInput}
          />
        </View>
        {cardType ? (
          <View style={styles.creditCardIconContainer}>
            <Image
              source={getCardLogo(cardType)}
              style={styles.creditCardIcon}
            />
          </View>
        ) : null}
      </View>
      <TextInput
        mode="flat"
        label={t('Name on Card')}
        autoCapitalize="words"
        value={creditCard.name}
        onChangeText={(name) => onCardValueChange({ ...creditCard, name })}
      />
      <View style={styles.flexRow}>
        <View style={styles.expirationDate}>
          <TextInput
            mode="flat"
            keyboardType="number-pad"
            label={t('Expiration Date (MM/YY)')}
            value={creditCard.expirationDate.date}
            onChangeText={(expirationDate) => {
              let { isPotentiallyValid } = valid.expirationDate(expirationDate);
              onCardValueChange({
                ...creditCard,
                expirationDate: {
                  date: formatExpiryDate(expirationDate),
                  isValid: isPotentiallyValid,
                },
              });
            }}
            errorMessage={
              !creditCard.expirationDate.isValid
                ? INVALID_EXPIRATION_DATE_MESSAGE
                : undefined
            }
            errorMessageStyle={styles.errorMessage}
            onBlur={() => {
              let { isValid } = valid.expirationDate(
                creditCard.expirationDate.date,
              );
              onCardValueChange({
                ...creditCard,
                expirationDate: {
                  ...creditCard.expirationDate,
                  isValid,
                },
              });
            }}
          />
        </View>
        <View style={styles.flex}>
          <TextInput
            mode="flat"
            secureTextEntry={true}
            keyboardType="number-pad"
            label={t('CVV')}
            value={creditCard.cvv}
            onChangeText={(cvv) => {
              let { card } = valid.number(creditCard.cardNumber.number);
              let maxLength = card ? card.code.size : 3;

              onCardValueChange({
                ...creditCard,
                cvv: limitLength(cleanNumber(cvv), maxLength),
              });
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blur: {
    borderColor: COLORS.lightGrey,
  },
  focus: {
    borderColor: COLORS.primaryColor,
  },
  error: {
    borderColor: COLORS.red,
  },
  flexRow: {
    flexDirection: 'row',
  },
  creditCardForm: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  expirationDate: {
    flex: 2,
    marginRight: 16,
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  cardNumberErrorStyle: {
    padding: 0,
    position: 'absolute',
    left: 0,
    bottom: -20,
  },
  cardNumberTextInput: { borderBottomWidth: 0 },
  creditCardIconContainer: {
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  creditCardIcon: {
    width: 45,
    height: 18,
    resizeMode: 'contain',
  },
});
