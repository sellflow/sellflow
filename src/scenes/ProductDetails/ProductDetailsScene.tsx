import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ActivityIndicator } from 'exoflex';
import { useRoute, useFocusEffect } from '@react-navigation/native';

import { VariantQueryData, OptionsData } from '../../types/types';
import { useGetWishlistData } from '../../hooks/api/useWishlist';
import { StackRouteProp } from '../../types/Navigation';
import {
  useAddToCart,
  useSetShoppingCartID,
  useGetCart,
} from '../../hooks/api/useShoppingCart';
import { useGetProductDetails } from '../../hooks/api/useProduct';
import { useGetCustomerData } from '../../hooks/api/useCustomer';
import { useAuth } from '../../helpers/useAuth';
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutReplaceItem,
} from '../../hooks/api/useShopifyCart';
import useDefaultCurrency from '../../hooks/api/useDefaultCurrency';
import { Toast, KeyboardAvoidingView } from '../../core-ui';
import { COLORS } from '../../constants/colors';
import { ScreenSize, useDimensions } from '../../helpers/dimensions';

import { ProductInfo, ImageModal, ImageList } from './components';
import BottomActionBar from './components/BottomActionBar';

export default function ProductDetailsScene() {
  let route = useRoute<StackRouteProp<'ProductDetails'>>();
  let { productHandle } = route.params;

  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  let [isWishlistActive, setWishlistActive] = useState<boolean>(false);
  let [quantity, setQuantity] = useState<number>(1);
  let [selectedOptions, setSelectedOptions] = useState<OptionsData>({});
  let [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
  let [activeIndex, setActiveIndex] = useState<number>(0);
  let [bottomButtonHeight, setBottomButtonHeight] = useState<number>(0);

  let { authToken } = useAuth();
  let { setShoppingCartID } = useSetShoppingCartID();
  let { shoppingCartCustomerAssociate } = useCheckoutCustomerAssociate();
  let { data: currencyCode } = useDefaultCurrency();

  let onPressImage = (index: number) => {
    setIsImageModalVisible(!isImageModalVisible);
    setActiveIndex(index);
  };

  let { createCheckout } = useCheckoutCreate({
    onCompleted: async ({ checkoutCreate }) => {
      if (checkoutCreate && checkoutCreate.checkout) {
        await setShoppingCartID({
          variables: { id: checkoutCreate.checkout.id },
        });
        if (authToken) {
          await shoppingCartCustomerAssociate({
            variables: {
              checkoutId: checkoutCreate.checkout.id,
              customerAccessToken: authToken,
            },
          });
        }
      }
    },
  });

  let { getCustomer } = useGetCustomerData({
    onCompleted: async ({ customer }) => {
      if (customer && customer.lastIncompleteCheckout == null) {
        await createCheckout({
          variables: {
            checkoutCreateInput: {
              lineItems: [],
              presentmentCurrencyCode: currencyCode,
            },
          },
        });
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (authToken) {
        getCustomer({ variables: { accessToken: authToken } });
      }
      return undefined;
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );
  useGetCart({
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ shoppingCart }) => {
      if (shoppingCart.id === '') {
        createCheckout({
          variables: {
            checkoutCreateInput: {
              lineItems: [],
              presentmentCurrencyCode: currencyCode,
            },
          },
        });
      }
    },
  });
  let showToast = (duration: number) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };

  let extractOptionsData = (
    optionsData: OptionsData,
  ): Array<VariantQueryData> => {
    let result: Array<VariantQueryData> = [];

    for (let option in optionsData) {
      if (option) {
        let processedForm: VariantQueryData = {
          name: option,
          value: optionsData[option],
        };
        result.push(processedForm);
      }
    }
    return result;
  };

  let changeSelectedOptions = (key: string, value: string) => {
    setSelectedOptions({ ...selectedOptions, [key]: value });
  };

  let {
    shoppingCartReplaceItems,
    loading: shoppingCartLoading,
  } = useCheckoutReplaceItem();

  let { addToCart, loading: addToCartLoading } = useAddToCart({
    onCompleted: async ({ addToShoppingCart }) => {
      let shoppingCartItems = addToShoppingCart.items.map(
        ({ variantId, quantity }) => {
          return { variantId, quantity };
        },
      );
      await shoppingCartReplaceItems({
        variables: {
          checkoutID: addToShoppingCart.id,
          lineItems: shoppingCartItems,
        },
      });
      showToast(1100);
    },
  });

  let {
    getVariant,
    data: productDetails,
    loading: getProductDetailsLoading,
  } = useGetProductDetails({
    variables: { productHandle, presentmentCurrencies: [currencyCode] },
    fetchPolicy: 'network-only',

    onCompleted(value) {
      let defaultOptions: OptionsData = {};
      value.productByHandle?.options.map(({ name, values }) => {
        return (defaultOptions[name] = values[0]);
      });
      setSelectedOptions(defaultOptions);
    },
  });

  useEffect(() => {
    let queryVariantID = extractOptionsData(selectedOptions);
    getVariant({
      variables: {
        selectedOptions: queryVariantID,
        handle: productHandle,
        presentmentCurrencies: [currencyCode],
      },
    });
  }, [selectedOptions, getVariant]); // eslint-disable-line react-hooks/exhaustive-deps

  let isLoading =
    getProductDetailsLoading || addToCartLoading || shoppingCartLoading;

  let { data: wishlistData } = useGetWishlistData({
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === productHandle)) {
        setWishlistActive(true);
      }
    },
  });
  let onAddToCart = async () => {
    addToCart({ variables: { variantId: productDetails.id, quantity } });
  };

  let isFirstLoading = !wishlistData || !productDetails;

  let { screenSize } = useDimensions();
  let isLandscape = screenSize === ScreenSize.Large;

  return isFirstLoading ? (
    <ActivityIndicator style={styles.centered} />
  ) : (
    <View style={styles.flex}>
      <View style={[styles.flex, isLandscape && styles.flexRow]}>
        {isLandscape && (
          <ImageList product={productDetails} onImagePress={onPressImage} />
        )}
        <View style={styles.flex}>
          <KeyboardAvoidingView keyboardVerticalOffset={-bottomButtonHeight}>
            <ScrollView style={styles.flex}>
              {!isLandscape && (
                <ImageList
                  product={productDetails}
                  onImagePress={onPressImage}
                />
              )}
              <ProductInfo
                selectedOptions={selectedOptions}
                onSelectionOptionChange={changeSelectedOptions}
                quantity={quantity}
                onChangeQuantity={setQuantity}
                product={productDetails}
                options={productDetails.options ? productDetails.options : []}
              />
            </ScrollView>
          </KeyboardAvoidingView>
          <View
            style={[
              styles.bottomContainer,
              isLandscape && styles.bottomLandscapeContainer,
            ]}
            onLayout={({ nativeEvent }) =>
              setBottomButtonHeight(nativeEvent.layout.height)
            }
          >
            <BottomActionBar
              isButtonDisabled={!productDetails.availableForSale}
              onAddToCartPress={onAddToCart}
              product={productDetails}
              isLoading={isLoading}
              isWishlistActive={isWishlistActive}
              onWishlistPress={(isActive) => {
                setWishlistActive(isActive);
              }}
            />
          </View>
        </View>
      </View>
      <Toast
        data={{
          message: t('Item Successfully Added'),
          isVisible: isToastVisible,
          mode: 'success',
        }}
      />
      <ImageModal
        activeIndex={activeIndex}
        images={productDetails.images}
        isVisible={isImageModalVisible}
        setVisible={setIsImageModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    position: 'absolute',
    left: 0,
    top: 17,
    zIndex: 14,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    marginBottom: 12,
  },
  bottomLandscapeContainer: {
    marginHorizontal: 36,
    marginBottom: 24,
  },
});
