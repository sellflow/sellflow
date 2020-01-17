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
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
  default: boolean;
};

export type Product = {
  id: string;
  image: string;
  name: string;
  price: number;
  discount?: number;
};

export type CategoryItem = {
  id: string;
  name: string;
};
