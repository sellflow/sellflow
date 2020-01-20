import { RouteProp as RoutePropBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryItem, Product } from './types';

export type NavigationProp<T extends keyof RootParamList> = StackNavigationProp<
  RootParamList,
  T
>;

export type RouteProp<T extends keyof RootParamList> = RoutePropBase<
  RootParamList,
  T
>;

export type RootParamList = {
  HomeTab: undefined;
  WishlistTab: undefined;
  ProfileTab: undefined;
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
