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

function useGetProductVariant(
  options?: QueryHookOptions<GetProductVariant, GetProductVariantVariables>,
) {
  let [getVariant, { data, loading }] = useLazyQuery<
    GetProductVariant,
    GetProductVariantVariables
  >(GET_PRODUCT_VARIANT, { ...options });
  return { getVariant, data, loading };
}

function useGetProductByHandle(
  options?: QueryHookOptions<GetProductByHandle, GetProductByHandleVariables>,
) {
  let { loading, data } = useQuery<
    GetProductByHandle,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE, { ...options });
  return { data, loading };
}

export { useGetProductByHandle, useGetProductVariant };
