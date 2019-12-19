import React from 'react';
import { StyleSheet, View, ViewProps, StyleProp } from 'react-native';

import { COLORS } from '../general/constants/colors';

type Props = {
  containerStyle?: StyleProp<ViewProps>;
  children?: React.ReactNode;
  mode?: 'row' | 'column';
};

export default function SectionHeader(props: Props) {
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
    padding: 12,
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
