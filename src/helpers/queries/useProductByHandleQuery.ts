import { useQuery, QueryHookOptions } from '@apollo/react-hooks';

import {
  GetProductByHandle,
  GetProductByHandleVariables,
} from '../../generated/server/GetProductByHandle';
import { GET_PRODUCT_BY_HANDLE } from '../../graphql/server/productByHandle';

export function useProductByHandleQuery(
  productHandle: string,
  options?: QueryHookOptions<GetProductByHandle, GetProductByHandleVariables>,
) {
  let { loading, data } = useQuery<
    GetProductByHandle,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      productHandle: productHandle,
    },
    ...options,
  });

  return { data, loading };
}
