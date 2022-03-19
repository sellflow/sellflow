import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
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
