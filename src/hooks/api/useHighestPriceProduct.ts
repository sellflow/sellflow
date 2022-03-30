import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import {
  GetHighestPrice,
  GetHighestPriceVariables,
} from '../../generated/server/GetHighestPrice';
import { GET_HIGHEST_PRICE } from '../../graphql/server/searchProduct';
import useDefaultCountry from './useDefaultCountry';

function useGetHighestPrice(
  options: Omit<
    QueryHookOptions<GetHighestPrice, GetHighestPriceVariables>,
    'onCompleted'
  > & { onCompleted: (value: number) => void },
) {
  let { onCompleted, ...otherOptions } = options;
  let { countryCode } = useDefaultCountry().data;
  let { data, error, loading, refetch } = useQuery<GetHighestPrice>(
    GET_HIGHEST_PRICE,
    {
      variables: { country: countryCode },
      ...otherOptions,
      onCompleted: ({ products }) => {
        let formattedPrice = Math.ceil(
          Number(products.edges[0].node.priceRange.maxVariantPrice.amount),
        );
        onCompleted(formattedPrice);
      },
    },
  );

  let formattedPrice = Math.ceil(
    Number(data?.products.edges[0].node.priceRange.maxVariantPrice.amount),
  );

  return { formattedPrice, error, loading, refetch };
}

export { useGetHighestPrice };
