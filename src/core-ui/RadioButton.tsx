import React, { ComponentProps } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { RadioButton as PaperRadioButton } from 'react-native-paper';

import { COLORS } from '../constants/colors';

import Text from './Text';

type Props = {
  style: StyleProp<ViewStyle>;
  size?: number;
  checked?: boolean;
  textStyle?: StyleProp<TextStyle>;
  label?: string;
} & ComponentProps<typeof PaperRadioButton>;

export default function RadioButton(props: Props) {
  let { style, size, checked, textStyle, label, ...radioProps } = props;
  return (
    <View style={[styles.container, style]}>
      <PaperRadioButton.Android
        {...radioProps}
        color={COLORS.primaryColor}
        uncheckedColor={COLORS.inactive}
        status={checked ? 'checked' : 'unchecked'}
      />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

RadioButton.Group = PaperRadioButton.Group;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  text: { paddingLeft: 10 },
});
