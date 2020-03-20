import React, { ReactNode } from 'react';
import {
  View,
  KeyboardAvoidingViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

type Props = KeyboardAvoidingViewProps & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function KeyboardAvoidingView({ style, children }: Props) {
  return <View style={[styles.defaultContainer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  defaultContainer: { flex: 1 },
});
