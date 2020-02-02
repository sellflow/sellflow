import { ReactNode } from 'react';
import { GetCustomer_customer as Customer } from '../generated/client/GetCustomer';
import { GetWishlist_wishlist as Wishlist } from '../generated/client/GetWishlist';

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
  handle: string;
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

export type LocalData = {
  customer: Customer;
  wishlist: Array<Wishlist>;
};

export type LocalCache = {
  data: LocalData;
};
