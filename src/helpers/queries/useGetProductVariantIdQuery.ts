import { useLazyQuery, QueryHookOptions } from '@apollo/react-hooks';

import {
  GetProductVariantID,
  GetProductVariantIDVariables,
} from '../../generated/server/GetProductVariantID';
import { GET_PRODUCT_VARIANT_ID } from '../../graphql/server/productByHandle';

export function useGetProductVariantIdQuery(
  options?: QueryHookOptions<GetProductVariantID, GetProductVariantIDVariables>,
) {
  let [getVariantID] = useLazyQuery<
    GetProductVariantID,
    GetProductVariantIDVariables
  >(GET_PRODUCT_VARIANT_ID, {
    ...options,
  });

  return { getVariantID };
}
