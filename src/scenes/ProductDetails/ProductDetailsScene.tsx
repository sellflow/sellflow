import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ActivityIndicator } from 'exoflex';
import { useRoute, useFocusEffect } from '@react-navigation/native';

import {
  VariantQueryData,
  Options,
  OptionsData,
  ProductDetails,
} from '../../types/types';
import { useGetWishlistData } from '../../hooks/api/useWishlist';
import { StackRouteProp } from '../../types/Navigation';
import {
  useAddToCart,
  useSetShoppingCartID,
} from '../../hooks/api/useShoppingCart';
import {
  useGetProductVariant,
  useGetProductByHandle,
} from '../../hooks/api/useProduct';
import { useGetCustomerData } from '../../hooks/api/useCustomer';
import { useAuth } from '../../helpers/useAuth';
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutReplaceItem,
} from '../../hooks/api/useShopifyCart';
import { ProductDetailsView } from './components';
import { Toast } from '../../core-ui';
import useDefaultCurrency from '../../hooks/api/useDefaultCurrency';
import { emptyProduct } from '../../constants/defaultValues';
import { getDiscount } from '../../helpers/getDiscount';

export default function ProductDetailsScene() {
  let route = useRoute<StackRouteProp<'ProductDetails'>>();
  let { productHandle } = route.params;

  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  let [isWishlistActive, setWishlistActive] = useState<boolean>(false);
  let [options, setOptions] = useState<Options>([]);
  let [quantity, setQuantity] = useState<number>(1);
  let [selectedOptions, setSelectedOptions] = useState<OptionsData>({});
  let [variantID, setVariantID] = useState<string>('');
  let [productDetails, setProductDetails] = useState<ProductDetails>(
    emptyProduct,
  );

  let { authToken } = useAuth();
  let { setShoppingCartID } = useSetShoppingCartID();
  let {
    shoppingCartCustomerAssociate,
    loading: associateLoading,
  } = useCheckoutCustomerAssociate();
  let { data: currencyCode } = useDefaultCurrency();
  let { createCheckout, loading: checkoutCreateLoading } = useCheckoutCreate({
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

  let { shoppingCartReplaceItems } = useCheckoutReplaceItem();

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

  let { getVariant, loading: getVariantIDLoading } = useGetProductVariant({
    onCompleted: ({ productByHandle }) => {
      if (productByHandle && productByHandle.variantBySelectedOptions) {
        let {
          id,
          presentmentPrices,
        } = productByHandle.variantBySelectedOptions;
        let { compareAtPrice, price } = presentmentPrices.edges[0].node;

        if (compareAtPrice) {
          let originalPrice = compareAtPrice.amount;
          if (originalPrice > price.amount) {
            let discount =
              ((compareAtPrice.amount - price.amount) / compareAtPrice.amount) *
              100;
            setProductDetails({
              ...productDetails,
              price: Number(originalPrice),
              discount,
            });
          }
        } else {
          setProductDetails({
            ...productDetails,
            price: Number(price.amount),
            discount: 0,
          });
        }
        setVariantID(id);
      }
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

  let isLoading = getVariantIDLoading || addToCartLoading;

  let { data: wishlistData } = useGetWishlistData({
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === productHandle)) {
        setWishlistActive(true);
      }
    },
  });

  let onAddToCart = () => {
    addToCart({ variables: { variantId: variantID, quantity } });
  };

  let {
    data: productData,
    loading: getProductByHandleLoading,
  } = useGetProductByHandle({
    variables: { productHandle, presentmentCurrencies: [currencyCode] },
    fetchPolicy: 'network-only',
    onCompleted({ productByHandle }) {
      if (productByHandle) {
        let images = productByHandle.images.edges.map(
          (item) => item.node.originalSrc,
        );
        let originalProductPrice = ~~productByHandle.variants.edges[0].node
          .presentmentPrices.edges[0].node.compareAtPrice?.amount;

        let productPrice = ~~productByHandle.variants.edges[0].node
          .presentmentPrices.edges[0].node.price.amount;

        let { price, discount } = getDiscount(
          originalProductPrice,
          productPrice,
        );

        setProductDetails({
          id: productByHandle.id,
          title: productByHandle.title,
          handle: productByHandle.handle,
          description: productByHandle.description,
          images,
          price,
          discount,
          url: productByHandle.onlineStoreUrl,
        });
        let newOptions = [...productByHandle.options];
        setOptions(newOptions);
        let defaultOptions: OptionsData = {};
        for (let { name, values } of newOptions) {
          defaultOptions[name] = values[0];
        }
        setSelectedOptions(defaultOptions);
      }
    },
    onError(error) {
      let newError = error.message.split(':');
      Alert.alert(newError[1]);
    },
  });
  let isFirstLoading =
    getProductByHandleLoading ||
    !productData ||
    !wishlistData ||
    addToCartLoading ||
    associateLoading ||
    checkoutCreateLoading;

  return isFirstLoading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <>
      <ProductDetailsView
        selectedOptions={selectedOptions}
        onSelectionOptionChange={changeSelectedOptions}
        quantity={quantity}
        onChangeQuantity={setQuantity}
        onAddToCartPress={onAddToCart}
        product={productDetails}
        options={options}
        isLoading={isLoading}
        isWishlistActive={isWishlistActive}
        onWishlistPress={(isActive) => {
          setWishlistActive(isActive);
        }}
      />
      <Toast
        data={{
          message: t('Item Successfully Added'),
          isVisible: isToastVisible,
          mode: 'success',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
