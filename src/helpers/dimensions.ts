import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type DeviceSize = {
  window: ScaledSize;
  screen: ScaledSize;
};

type Dimension = {
  width: number;
  height: number;
};

export enum ScreenSize {
  Small = 1,
  Medium = 2,
  Large = 3,
}

const MAX_SMALL = 600;
const MAX_MEDIUM = 900;

export function useDimensions() {
  let [dimensions, setDimensions] = useState<Dimension>(() => {
    let { width, height } = Dimensions.get('screen');
    return { width, height };
  });
  let { width, height } = dimensions;

  let screenSize: ScreenSize;
  if (width < MAX_SMALL) {
    screenSize = ScreenSize.Small;
  } else if (width < MAX_MEDIUM) {
    screenSize = ScreenSize.Medium;
  } else {
    screenSize = ScreenSize.Large;
  }

  useEffect(() => {
    let onChange = ({ screen }: DeviceSize) => {
      let { width, height } = screen;
      setDimensions({ width, height });
    };
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  return {
    width,
    height,
    screenSize,
    isLandscape: width > height,
  };
}
