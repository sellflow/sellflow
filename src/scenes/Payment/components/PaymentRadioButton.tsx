import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { RadioButton } from 'exoflex';

import { COLORS } from '../../../constants/colors';

type Props = {
  style?: StyleProp<ViewStyle>;
  isSelected: boolean;
  onSelect: (value: string) => void;
  label: ReactNode;
  children?: ReactNode;
  value: string;
};

export default function PaymentRadioButton(props: Props) {
  let { style, isSelected, children, label, value, onSelect } = props;
  return isSelected ? (
    <View style={[styles.container, style]}>
      <View style={styles.flexRow}>
        <RadioButton
          value={value}
          size={18}
          style={styles.radioButton}
          checked={isSelected}
        />
        {label}
      </View>
      {children}
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => onSelect(value)}>
      <View style={[styles.container, styles.flexRow, style]}>
        <RadioButton
          value={value}
          size={18}
          style={styles.radioButton}
          checked={isSelected}
        />
        {label}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  greyBorder: {
    borderColor: COLORS.lightGrey,
  },
  selectedBorder: {
    borderColor: COLORS.primaryColor,
  },
  radioButton: {
    padding: 14,
    width: 48,
  },
});
