import React, { ComponentProps } from 'react';
import { StyleSheet, TextInput as NativeTextInput } from 'react-native';

import { COLORS } from '../constants/colors';

import TextInput from './TextInput';

type Props = ComponentProps<typeof NativeTextInput>;

export default function SearchInput(props: Props) {
  let { style, ...otherProps } = props;

  return (
    <TextInput
      containerStyle={[styles.textInputContainer, style]}
      clearButtonMode="while-editing"
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.darkWhite,
    borderColor: COLORS.darkWhite,
  },
});
