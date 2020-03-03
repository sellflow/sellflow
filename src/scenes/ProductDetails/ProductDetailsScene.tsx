import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ActivityIndicator } from 'exoflex';
import { useRoute } from '@react-navigation/native';

import {
  VariantQueryData,
  Tabs,
  Options,
  OptionsData,
} from '../../types/types';
import { useGetWishlistData } from '../../hooks/api/useWishlist';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import { StackRouteProp } from '../../types/Navigation';
import { useAddToCart } from '../../hooks/api/useShoppingCart';
import {
  useGetProductVariant,
  useGetProductByHandle,
} from '../../hooks/api/useProduct';
import ProductLandscape from './components/ProductLandscape';
import ProductPortrait from './components/ProductPortrait';

export default function ProductDetailsScene() {
  let dimensions = useDimensions();
  let route = useRoute<StackRouteProp<'ProductDetails'>>();
  let { product } = route.params;

  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  let [isWishlistActive, setWishlistActive] = useState<boolean>(false);
  let [options, setOptions] = useState<Options>([]);
  let [quantity, setQuantity] = useState<number>(1);
  let [selectedOptions, setSelectedOptions] = useState<OptionsData>({});
  let [infoTabs, setInfoTabs] = useState<Tabs>([
    { title: t('Description'), content: '' },
  ]);
  let [productImages, setProductImages] = useState<Array<string>>([]);
  let [productDiscount, setProductDiscount] = useState<number>(0);
  let [productOriginalPrice, setProductOriginalPrice] = useState<number>(0);
  let [variantID, setVariantID] = useState<string>('');

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

  let { addToCart, loading: addToCartLoading } = useAddToCart({
    onCompleted: () => {
      showToast(1100);
    },
  });

  let { getVariant, loading: getVariantIDLoading } = useGetProductVariant({
    onCompleted: ({ productByHandle }) => {
      if (productByHandle && productByHandle.variantBySelectedOptions) {
        let {
          id,
          compareAtPriceV2,
          priceV2,
        } = productByHandle.variantBySelectedOptions;
        if (compareAtPriceV2) {
          let originalPrice = compareAtPriceV2.amount;
          let discount =
            ((compareAtPriceV2.amount - priceV2.amount) /
              compareAtPriceV2.amount) *
            100;
          setProductDiscount(discount);
          setProductOriginalPrice(Math.round(originalPrice));
        }

        setVariantID(id);
      }
    },
  });

  useEffect(() => {
    let queryVariantID = extractOptionsData(selectedOptions);
    getVariant({
      variables: { selectedOptions: queryVariantID, handle: product.handle },
    });
  }, [selectedOptions, getVariant, product.handle]);

  let isLoading = getVariantIDLoading || addToCartLoading;

  let { data: wishlistData } = useGetWishlistData({
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === product.handle)) {
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
    variables: { productHandle: product.handle },
    fetchPolicy: 'network-only',
    onCompleted({ productByHandle }) {
      if (productByHandle) {
        let newOptions = [...options, ...productByHandle.options];
        setOptions(newOptions);
        setInfoTabs([
          ...[
            {
              title: t('Description'),
              content:
                productByHandle.description !== ''
                  ? productByHandle.description
                  : t('No Description Yet'),
            },
          ],
        ]);
        setProductImages(
          productByHandle.images.edges.map((item) => item.node.originalSrc),
        );
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

  return getProductByHandleLoading || !productData || !wishlistData ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : dimensions.screenSize === ScreenSize.Large ? (
    <ProductLandscape
      isToastVisible={isToastVisible}
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
      product={product}
      productImages={productImages}
      productDiscount={productDiscount}
      productOriginalPrice={productOriginalPrice}
      options={options}
      isLoading={isLoading}
      infoTabs={infoTabs}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
  ) : (
    <ProductPortrait
      isToastVisible={isToastVisible}
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
      product={product}
      productImages={productImages}
      productDiscount={productDiscount}
      productOriginalPrice={productOriginalPrice}
      options={options}
      isLoading={isLoading}
      infoTabs={infoTabs}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
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
