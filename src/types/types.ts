import { ReactNode } from 'react';
import { GetAuthenticatedUser_authenticatedUser as AuthenticatedUser } from '../generated/client/GetAuthenticatedUser';
import { GetWishlist_wishlist as Wishlist } from '../generated/client/GetWishlist';
import { GetShoppingCart_shoppingCart as ShoppingCart } from '../generated/client/GetShoppingCart';
import { GetRecentSearch_recentSearch as RecentSearch } from '../generated/client/GetRecentSearch';

export type CarouselItem = {
  render: () => ReactNode;
  image: string;
  onItemPress?: () => void;
};

export type OrderItem = {
  image: string;
  title: string;
  originalPrice: number;
  variantID: string;
  quantity: number;
  priceAfterDiscount?: number;
  variant: string;
  onRemovePress?: (variantID: string) => void;
  onChangeQuantity?: (variantIDSearched: string, amount: number) => void;
};

export type IndicatorItem = {
  label: string;
  timestamp?: string;
};

export type OrderRecord = {
  orderID: string;
  orderNumber: string;
  orderTime: string;
  totalPayment: number;
  subtotalPayment: number;
  shippingPrice: number;
  address: AddressItem;
  lineItems: Array<LineItem>;
};

export type AddressItem = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
  default?: boolean;
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
  authenticatedUser: AuthenticatedUser;
  wishlist: Array<Wishlist>;
  shoppingCart: ShoppingCart;
  recentSearch: Array<RecentSearch>;
};

export type LocalCache = {
  data: LocalData;
};
export type VariantQueryData = {
  name: string;
  value: string;
};

export type Cart = {
  id: string;
  subtotalPrice: number;
  totalPrice: number;
  lineItemsPrice: number;
  lineItems: Array<LineItem>;
};

export type LineItem = {
  variantID: string;
  variant: string;
  title: string;
  priceAfterDiscount: number;
  originalPrice: number;
  image: string;
  quantity: number;
};

export type PaymentInfo = {
  totalPrice: number;
  subtotalPrice: number;
  shippingLines: Array<ShippingLine>;
};

export type ShippingLine = {
  handle: string;
  amount: number;
  title: string;
};
