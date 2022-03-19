import { useEffect, useMemo } from 'react';
import { Animated, Keyboard } from 'react-native';

export function useKeyboardListener(keyboardVerticalOffset = 0) {
  let keyboardHeight = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    let keyboardWillShow = Keyboard.addListener('keyboardWillShow', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + keyboardVerticalOffset,
        useNativeDriver: true,
      }).start();
    });
    let keyboardWillHide = Keyboard.addListener('keyboardWillHide', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardHeight, keyboardVerticalOffset]);

  return { keyboardHeight };
}
