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
  OrderHistory: undefined;
  OrderDetails: { orderID: string };
  AddressManagement: undefined;
  Wishlist: undefined;
  Profile: undefined;
  ProductCollection: { collection: CategoryItem };
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Checkout: undefined;
  ProductDetails: { product: Product };
  ShoppingCart: undefined;
  Search: undefined;
  EditProfile: undefined;
  Payment: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  WishlistTab: undefined;
  ProfileTab: undefined;
};

export type StackRouteName = keyof StackParamList;
export type TabRouteName = keyof TabParamList;
