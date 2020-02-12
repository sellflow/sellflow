import { RouteProp as RoutePropBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CategoryItem, Product } from './types';

export type StackNavProp<T extends keyof StackParamList> = StackNavigationProp<
  StackParamList,
  T
>;

export type TabNavProp<T extends keyof TabParamList> = BottomTabNavigationProp<
  TabParamList,
  T
>;

export type StackRouteProp<T extends keyof StackParamList> = RoutePropBase<
  StackParamList,
  T
>;

export type TabRouteProp<T extends keyof TabParamList> = RoutePropBase<
  TabParamList,
  T
>;

export type StackParamList = {
  Home: undefined;
  OrderHistory: { customerAccessToken: string };
  OrderDetails: { orderID: string };
  AddressManagement: { customerAccessToken: string };
  Wishlist: undefined;
  Profile: undefined;
  ProductCollection: CollectionParams;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Checkout: undefined;
  ProductDetails: { product: Product };
  ShoppingCart: undefined;
  Search: undefined;
  EditProfile: { customerAccessToken: string };
  Payment: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  WishlistTab: undefined;
  ProfileTab: undefined;
};

export type CollectionParams = {
  collection?: CategoryItem;
  searchKeyword?: string;
};

export type StackRouteName = keyof StackParamList;
export type TabRouteName = keyof TabParamList;
