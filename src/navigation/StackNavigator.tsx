import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'exoflex';
import { NavigationState, Route } from '@react-navigation/native';

import {
  OrderDetailsScene,
  OrderHistoryScene,
  ProductDetailsScene,
  ProductCollectionScene,
  ForgotPasswordScene,
  ShoppingCartScene,
  CheckoutScene,
  AddressManagementScene,
  AddEditAddressScene,
  EditProfileScene,
  AuthScene,
  SearchResultsScene,
  OrderPlacedConfirmationScene,
  WebViewScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { StackParamList } from '../types/Navigation';
import { useCartFilled } from '../helpers/cartFilled';
import { useAuth } from '../helpers/useAuth';
import { CurrencyPicker } from '../components';
import { useGetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';

import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<StackParamList>();

type HeaderIconButtonProps = {
  icon: string;
  onPress: () => void;
};

function HeaderIconButton(props: HeaderIconButtonProps) {
  let { icon, onPress } = props;
  let { isFilled, numOfItems } = useCartFilled();
  if (icon === 'cart' && isFilled) {
    return (
      <View style={styles.flex}>
        <IconButton
          icon={icon}
          onPress={onPress}
          color={COLORS.primaryColor}
          style={styles.headerButton}
        />
        <View style={styles.cartBadge}>
          <Text style={styles.badgeText}>{numOfItems}</Text>
        </View>
      </View>
    );
  }

  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      color={COLORS.primaryColor}
      style={styles.headerButton}
    />
  );
}

export default function StackNavigator() {
  let { authToken } = useAuth();
  let { data: userData } = useGetAuthenticatedUser();

  function getTabSceneName(
    route: { state?: NavigationState } & Pick<Route<string>, 'key' | 'name'>,
  ) {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : 'HomeTab';
    return routeName;
  }

  return (
    <Stack.Navigator
      screenOptions={headerOptions}
      headerMode="screen"
      initialRouteName={'Home'}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={({ navigation, route }) => {
          let tabScene = getTabSceneName(route);
          if (tabScene === 'HomeTab') {
            return {
              title:
                authToken && userData?.authenticatedUser.firstName
                  ? `${t('Hello')}, ${userData.authenticatedUser.firstName}`
                  : t('Hello'),
              headerLeft: () => <CurrencyPicker />,
              headerRight: () => (
                <HeaderIconButton
                  icon="cart"
                  onPress={() => navigation.navigate('ShoppingCart')}
                />
              ),
              headerStyle: {
                shadowColor: COLORS.transparent,
                elevation: 0,
              },
            };
          } else if (tabScene === 'WishlistTab') {
            return {
              headerLeft: () => null,
              title: t('Wishlist'),
            };
          } else {
            return authToken
              ? {
                  headerLeft: () => null,
                  title: t('My Profile'),
                }
              : {
                  headerLeft: () =>
                    !authToken && (
                      <HeaderIconButton
                        icon="chevron-left"
                        onPress={() => navigation.navigate('HomeTab')}
                      />
                    ),
                  title: '',
                  headerStyle: {
                    shadowColor: COLORS.transparent,
                    elevation: 0,
                  },
                };
          }
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScene}
        options={() => ({
          title: t('Welcome'),
          headerStyle: {
            shadowColor: COLORS.transparent,
            elevation: 0,
          },
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={() => ({
          title: t('Forgot Password'),
          cardStyle: {
            backgroundColor: COLORS.white,
          },
        })}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScene}
        options={() => ({
          title: t('Manage Addresses'),
        })}
      />
      <Stack.Screen name="AddEditAddress" component={AddEditAddressScene} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScene}
        options={() => ({
          title: t('Edit Profile'),
        })}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={() => ({
          title: t('Order History'),
          cardStyle: {
            backgroundColor: COLORS.darkWhite,
          },
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScene}
        options={() => ({
          title: t('Order Details'),
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScene}
        options={({ navigation }) => ({
          title: t('Product Details'),
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate('ShoppingCart')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCartScene}
        options={() => ({
          title: t('Shopping Cart'),
        })}
      />
      <Stack.Screen
        name="ProductCollection"
        component={ProductCollectionScene}
        options={({ route }) => ({
          title: route.params.collection.title,
        })}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScene}
        options={() => ({
          title: t('Search Results'),
          headerRight: () => (
            <HeaderIconButton icon="magnify" onPress={() => {}} />
          ),
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScene}
        options={() => ({
          title: t('Checkout'),
        })}
      />
      <Stack.Screen name="WebView" component={WebViewScene} />

      <Stack.Screen
        name="OrderPlacedConfirmation"
        component={OrderPlacedConfirmationScene}
        options={() => ({
          title: t('Order Placed'),
          headerLeft: () => null,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerButton: {
    marginRight: 8,
  },
  cartBadge: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 7,
    position: 'absolute',
    top: 5,
    right: 12,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
  },
});
