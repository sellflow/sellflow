import { ReactNode } from 'react';

import { GetAuthenticatedUser_authenticatedUser as AuthenticatedUser } from '../generated/client/GetAuthenticatedUser';
import { GetWishlist_wishlist as Wishlist } from '../generated/client/GetWishlist';
import { GetShoppingCart_shoppingCart as ShoppingCart } from '../generated/client/GetShoppingCart';
import { GetRecentSearch_recentSearch as RecentSearch } from '../generated/client/GetRecentSearch';

export type CarouselItem = {
  render?: () => ReactNode;
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
  quantityAvailable: number;
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
  cursor?: string;
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
  cursor?: string;
  name?: string;
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
  cursor?: string;
  images: Array<string>;
  title: string;
  handle: string;
  productType?: string;
  price: number;
  discount: number;
  availableForSale: boolean;
  quantityAvailable?: number;
};

export type ProductDetails = {
  description: string;
  url: string;
  options?: Options;
} & Product;

export type CategoryItem = {
  id: string;
  title: string;
  handle: string;
  cursor: string;
  image?: string;
};

export type LocalData = {
  authenticatedUser: AuthenticatedUser;
  wishlist: Array<Wishlist>;
  shoppingCart: ShoppingCart;
  recentSearch: Array<RecentSearch>;
  defaultCurrency: string;
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
  quantityAvailable: number;
};

export type PaymentInfo = {
  totalPrice: number;
  subtotalPrice: number;
};

export type Payment = {
  id: string;
  name: string;
};

export type PaymentDetailsProps = { name: string; value: string };

export type PaymentData = {
  total: number;
  subtotal: number;
};

export type Options = Array<{ name: string; values: Array<string> }>;

export type Tabs = Array<{ title: string; content: string }>;

export type OptionsData = {
  [id: string]: string;
};

export type Scene = () => JSX.Element;
export type TabRoute = {
  key: string;
  title: string;
  scene: Scene;
};
