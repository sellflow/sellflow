import { useEffect, useMemo } from 'react';
import { Keyboard, Animated } from 'react-native';

export function useKeyboardListener(keyboardVerticalOffset = 0) {
  let keyboardHeight = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    let keyboardWillShow = Keyboard.addListener('keyboardWillShow', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + keyboardVerticalOffset,
      }).start();
    });
    let keyboardWillHide = Keyboard.addListener('keyboardWillHide', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardHeight, keyboardVerticalOffset]);

  return { keyboardHeight };
}
