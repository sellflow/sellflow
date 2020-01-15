import { ReactNode } from 'react';

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
  totalPayment: number;
};

export type AddressItem = {
  id: number;
  name: string;
  phoneNumber: string;
  city: string;
  address: string;
  zip: string;
  default: boolean;
};
