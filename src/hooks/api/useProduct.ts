import { QueryHookOptions, useLazyQuery, useQuery } from '@apollo/react-hooks';

import {
  GetProductVariantID,
  GetProductVariantIDVariables,
} from '../../generated/server/GetProductVariantID';

import {
  GET_PRODUCT_VARIANT_ID,
  GET_PRODUCT_BY_HANDLE,
} from '../../graphql/server/productByHandle';

import {
  GetProductByHandle,
  GetProductByHandleVariables,
} from '../../generated/server/GetProductByHandle';

function useGetProductVariantID(
  options?: QueryHookOptions<GetProductVariantID, GetProductVariantIDVariables>,
) {
  let [getVariantID, { loading }] = useLazyQuery<
    GetProductVariantID,
    GetProductVariantIDVariables
  >(GET_PRODUCT_VARIANT_ID, { ...options });
  return { getVariantID, loading };
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

export { useGetProductByHandle, useGetProductVariantID };
