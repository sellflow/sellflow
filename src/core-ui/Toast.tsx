import React from 'react';
import { StyleSheet, TextStyle, StyleProp, ViewStyle } from 'react-native';
import { Toast as ExoToast } from 'exoflex';

import { COLORS } from '../constants/colors';
import { ModeProps } from 'exoflex/lib/typescript/src/components/Toast';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  data: Data;
};

type Data = {
  message: string;
  isVisible: boolean;
  mode: ModeProps;
};

export default function Toast(props: Props) {
  let { containerStyle, textStyle, data } = props;
  let { mode, isVisible, message } = data;
  return (
    <ExoToast
      visible={isVisible}
      mode={mode}
      textStyle={textStyle}
      style={[styles.toastContainer, containerStyle]}
    >
      {message}
    </ExoToast>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: COLORS.black,
    borderRadius: 2,
    marginBottom: 40,
  },
});
