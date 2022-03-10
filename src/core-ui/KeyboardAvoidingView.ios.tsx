import React, { ReactNode } from 'react';
import {
  StyleProp,
  ViewStyle,
  KeyboardAvoidingViewProps,
  StyleSheet,
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
} from 'react-native';

type Props = KeyboardAvoidingViewProps & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function KeyboardAvoidingView(props: Props) {
  const { children, behavior = 'padding', style, ...otherProps } = props;

  return (
    <NativeKeyboardAvoidingView
      behavior={behavior}
      style={[styles.flex, style]}
      {...otherProps}
    >
      {children}
    </NativeKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
