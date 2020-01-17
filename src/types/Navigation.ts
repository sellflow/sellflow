import { RouteProp as RoutePropBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type NavigationProp<T extends keyof RootParamList> = StackNavigationProp<
  RootParamList,
  T
>;

export type RouteProp<T extends keyof RootParamList> = RoutePropBase<
  RootParamList,
  T
>;

export type RootParamList = {
  Home: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderID: string };
  AddressManagement: undefined;
  Wishlist: undefined;
  Profile: undefined;
  ProductCollection: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Checkout: undefined;
  ProductDetails: undefined;
  ShoppingCart: undefined;
  Search: undefined;
  EditProfile: undefined;
};
