import React, { ReactNode } from 'react';
import {
  StyleProp,
  ViewStyle,
  KeyboardAvoidingViewProps,
  Animated,
  StyleSheet,
} from 'react-native';

import { useKeyboardListener } from '../helpers/keyboardListener';

type Props = KeyboardAvoidingViewProps & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function KeyboardAvoidingView(props: Props) {
  let { keyboardHeight } = useKeyboardListener(props.keyboardVerticalOffset);

  let animatedViewStyle = () => {
    return [
      {
        paddingBottom: keyboardHeight,
      },
    ];
  };

  return (
    <Animated.View style={[styles.flex, animatedViewStyle()]}>
      {props.children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
