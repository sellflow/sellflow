import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { ViewPortInfo, DeviceInfo } from '../types/types';

export function useDimensions(): ViewPortInfo {
  const BREAKPOINT = 768;

  let [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('screen'),
  );
  let { width, height } = dimensions;

  let device: DeviceInfo = {
    deviceType: width >= BREAKPOINT ? 'TABLET' : 'MOBILE',
    orientation: width > height ? 'LANDSCAPE' : 'PORTRAIT',
  };

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
  return { screenSize: dimensions, device };
}
