import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  mode?: 'row' | 'column';
};

export default function Surface(props: Props) {
  let { containerStyle, children, mode = 'column' } = props;

  return (
    <View
      style={[
        mode === 'row' ? styles.containerRow : {},
        styles.container,
        containerStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.darkWhite,
    justifyContent: 'space-between',
  },
  containerRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
