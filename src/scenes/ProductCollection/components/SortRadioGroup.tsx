import React from 'react';
import { StyleSheet } from 'react-native';
import { RadioButton } from 'exoflex';

import { FONT_SIZE, FONT_FAMILY } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';

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
        label={t('Popularity')}
        {...(!radioButtonValue && { checked: true })}
        style={styles.radioButton}
        textStyle={
          !radioButtonValue
            ? styles.activeTextStyle
            : textStyle(t('Popularity'))
        }
      />
      <RadioButton
        label={t('Price from High to Low')}
        style={styles.radioButton}
        textStyle={textStyle(t('Price from High to Low'))}
      />
      <RadioButton
        label={t('Price from Low to High')}
        style={styles.radioButton}
        textStyle={textStyle(t('Price from Low to High'))}
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
