import { ReactNode } from 'react';
import { ScaledSize } from 'react-native';

export type CarouselItem = {
  content?: ReactNode;
  image: string;
  onItemPress?: () => void;
};

export type OrderItem = {
  variantID: string;
  itemName: string;
  quantity: number;
  itemPrice: number;
  discount?: number;
  variant: string;
  imageURL: string;
  cardType: 'checkout' | 'order';
  onRemovePress?: (variantID: string) => void;
};

export type IndicatorItem = {
  label: string;
  timestamp?: string;
};

export type OrderRecord = {
  orderID: string;
  orderTime: string;
  totalPayment: string;
};

export type DeviceType = 'MOBILE' | 'TABLET';

export type ViewPortInfo = {
  screenSize: ScaledSize;
  device: DeviceInfo;
};

export type DeviceInfo = {
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  deviceType: DeviceType;
};
