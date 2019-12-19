import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export function useDimensions(): ScaledSize {
  let [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('screen'),
  );
  useEffect(() => {
    let listenerHanlder: ({
      window,
      screen,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => void = ({ screen }) => {
      setDimensions(screen);
    };
    Dimensions.addEventListener('change', listenerHanlder);
    return () => Dimensions.removeEventListener('change', listenerHanlder);
  }, []);
  return dimensions;
}
