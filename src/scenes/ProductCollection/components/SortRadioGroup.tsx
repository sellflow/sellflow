import React from 'react';
import { StyleSheet } from 'react-native';
import { RadioButton } from 'exoflex';

import { FONT_SIZE, FONT_FAMILY } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';
import { PRODUCT_SORT_VALUES } from '../../../constants/values';

type Props = {
  radioButtonValue: string;
  onValueChange: (newValue: string) => void;
};

export default function SortRadioGroup(props: Props) {
  let { radioButtonValue, onValueChange } = props;

  let textStyle = (label: string) => [
    styles.radioButtonText,
    radioButtonValue === label
      ? styles.activeTextStyle
      : styles.inactiveTextStyle,
  ];

  return (
    <RadioButton.Group value={radioButtonValue} onValueChange={onValueChange}>
      <RadioButton
        value={PRODUCT_SORT_VALUES.POPULARITY}
        label={PRODUCT_SORT_VALUES.POPULARITY}
        {...(!radioButtonValue && { checked: true })}
        style={styles.radioButton}
        textStyle={
          !radioButtonValue
            ? [styles.radioButtonText, styles.activeTextStyle]
            : textStyle(PRODUCT_SORT_VALUES.POPULARITY)
        }
      />
      <RadioButton
        value={PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW}
        label={PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW}
        style={styles.radioButton}
        textStyle={textStyle(PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW)}
      />
      <RadioButton
        value={PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH}
        label={PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH}
        style={styles.radioButton}
        textStyle={textStyle(PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH)}
      />
    </RadioButton.Group>
  );
}

const styles = StyleSheet.create({
  radioButton: {
    paddingVertical: 17,
  },
  radioButtonText: {
    marginLeft: 15,
    fontSize: FONT_SIZE.medium,
  },
  activeTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
  },
  inactiveTextStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.black,
    opacity: 0.6,
  },
});
