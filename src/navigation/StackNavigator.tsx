import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'exoflex';
import { Route, NavigationProp } from '@react-navigation/native';

import {
  HomeScene,
  WishlistScene,
  ProfileScene,
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
  LockScene,
  OrderPlacedConfirmationScene,
  WebViewScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import {
  StackParamList,
  StackRouteName,
  TabRouteName,
  TabParamList,
} from '../types/Navigation';
import { useCartFilled } from '../helpers/cartFilled';
import { useAuth } from '../helpers/useAuth';

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

export default function StackNavigator({
  route,
  navigation,
}: {
  route: Route<TabRouteName>;
  navigation: NavigationProp<TabParamList>;
}) {
  let { authToken } = useAuth();
  let initialRouteName: StackRouteName;
  if (route.name === 'HomeTab') {
    initialRouteName = 'Home';
  } else if (route.name === 'WishlistTab') {
    initialRouteName = 'Wishlist';
  } else if (authToken) {
    initialRouteName = 'Profile';
  } else {
    initialRouteName = 'LockScene';
  }

  if (initialRouteName === 'LockScene') {
    navigation.setOptions({
      tabBarVisible: false,
    });
  }

  return (
    <Stack.Navigator
      screenOptions={headerOptions}
      headerMode="screen"
      initialRouteName={initialRouteName}
    >
      {initialRouteName === 'Home' ? (
        <Stack.Screen
          name="Home"
          component={HomeScene}
          options={({ navigation }) => ({
            title: t('Hello'),
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
          })}
        />
      ) : null}
      <Stack.Screen
        name="Wishlist"
        component={WishlistScene}
        options={() => ({
          headerLeft: () => null,
        })}
      />
      {authToken ? (
        <Stack.Screen
          name="Profile"
          component={ProfileScene}
          options={() => ({
            title: 'My Profile',
            headerLeft: () => null,
          })}
        />
      ) : (
        <Stack.Screen
          name="LockScene"
          component={LockScene}
          options={() => ({
            title: '',
            headerStyle: {
              shadowColor: COLORS.transparent,
              elevation: 0,
            },
          })}
        />
      )}
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
      {initialRouteName === 'Profile' ? (
        <>
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
        </>
      ) : null}
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
