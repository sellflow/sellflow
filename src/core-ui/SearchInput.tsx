import React, { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'exoflex';

import { COLORS } from '../general/constants/colors';

type Props = ComponentProps<typeof TextInput> & {};

export default function SearchInput(props: Props) {
  let { containerStyle, ...otherProps } = props;

  return (
    <View style={styles.container}>
      <TextInput
        containerStyle={[styles.textInputContainer, containerStyle]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  textInputContainer: {
    minWidth: 250,
    height: 42,
    marginHorizontal: 36,
    borderRadius: 8,
    backgroundColor: COLORS.darkWhite,
    borderColor: COLORS.darkWhite,
  },
});
