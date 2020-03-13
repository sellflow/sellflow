import { useState, useEffect } from 'react';
import { QueryHookOptions, useLazyQuery, useQuery } from '@apollo/react-hooks';

import {
  GetProductVariant,
  GetProductVariantVariables,
} from '../../generated/server/GetProductVariant';
import {
  GET_PRODUCT_VARIANT,
  GET_PRODUCT_BY_HANDLE,
} from '../../graphql/server/productByHandle';
import {
  GetProductByHandle,
  GetProductByHandleVariables,
} from '../../generated/server/GetProductByHandle';
import { getDiscount } from '../../helpers/getDiscount';

function useGetProductDetails(
  options?: QueryHookOptions<GetProductByHandle, GetProductByHandleVariables>,
) {
  let [productDetails, setProductDetails] = useState();

  let { loading, data } = useQuery<
    GetProductByHandle,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE, { ...options });

  let [
    getVariant,
    { data: variantData, loading: variantLoading },
  ] = useLazyQuery<GetProductVariant, GetProductVariantVariables>(
    GET_PRODUCT_VARIANT,
  );

  let productByHandle = data?.productByHandle;
  let variantProductByHandle = variantData?.productByHandle;

  useEffect(() => {
    if (productByHandle) {
      let images = productByHandle.images.edges.map(
        (item) => item.node.originalSrc,
      );
      let originalProductPrice = Number(
        productByHandle.variants.edges[0].node.presentmentPrices.edges[0].node
          .compareAtPrice?.amount,
      );

      let productPrice = Number(
        productByHandle.variants.edges[0].node.presentmentPrices.edges[0].node
          .price.amount,
      );

      let { price, discount } = getDiscount(originalProductPrice, productPrice);

      let newOptions = [...productByHandle.options];

      if (
        variantProductByHandle &&
        variantProductByHandle.variantBySelectedOptions == null
      ) {
        setProductDetails({
          id: '',
          title: productByHandle.title,
          handle: productByHandle.handle,
          description: productByHandle.description,
          images,
          price,
          discount,
          url: productByHandle.onlineStoreUrl,
          options: newOptions,
          availableForSale: false,
        });
      } else if (
        variantProductByHandle &&
        variantProductByHandle.variantBySelectedOptions
      ) {
        let {
          id,
          presentmentPrices,
          availableForSale,
        } = variantProductByHandle.variantBySelectedOptions;
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
              availableForSale,
              id,
            });
          }
        } else {
          setProductDetails({
            ...productDetails,
            price: Number(price.amount),
            discount: 0,
            availableForSale,
            id,
          });
        }
      } else {
        setProductDetails({
          id: productByHandle.id,
          title: productByHandle.title,
          handle: productByHandle.handle,
          description: productByHandle.description,
          images,
          price,
          discount,
          url: productByHandle.onlineStoreUrl,
          availableForSale: productByHandle.availableForSale,
          options: newOptions,
        });
      }
    }
  }, [productByHandle, variantProductByHandle]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    getVariant,
    data: productDetails,
    loading: loading || variantLoading,
  };
}

export { useGetProductDetails };
