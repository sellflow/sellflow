import React from 'react';
import { StyleSheet, TextStyle, StyleProp, ViewStyle } from 'react-native';
import { Toast as ExoToast } from 'exoflex';
import { ModeProps } from 'exoflex/lib/typescript/src/components/Toast';

import { COLORS } from '../constants/colors';

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
      showIcon={false}
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
