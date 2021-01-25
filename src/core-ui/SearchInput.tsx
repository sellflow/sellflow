import React, { ComponentProps } from 'react';
import { StyleSheet, TextInput as NativeTextInput } from 'react-native';
import { TextInput } from 'exoflex';

import { COLORS } from '../constants/colors';

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
