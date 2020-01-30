import { ReactNode } from 'react';

export type CarouselItem = {
  render: () => ReactNode;
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
  id: string;
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
  title: string;
  productType?: string;
  price: number;
  discount?: number;
};

// TODO: Rename Category to Collection
export type CategoryItem = {
  id: string;
  title: string;
  handle: string;
};

export type CachedData = {
  data: Data;
};

type Data = {
  customer: Customer;
};

type Customer = {
  __typename: string;
  email: string;
  id: string;
  expiresAt: string;
  firstName: string;
  lastName: string;
};
