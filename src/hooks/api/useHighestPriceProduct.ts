import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import { GET_HIGHEST_PRICE } from '../../graphql/server/searchProduct';
import {
  GetHighestPrice,
  GetHighestPriceVariables,
} from '../../generated/server/GetHighestPrice';

import useDefaultCurrency from './useDefaultCurrency';

function useGetHighestPrice(
  options: Omit<
    QueryHookOptions<GetHighestPrice, GetHighestPriceVariables>,
    'onCompleted'
  > & { onCompleted: (value: number) => void },
) {
  let { onCompleted, ...otherOptions } = options;
  let currentCurrency = useDefaultCurrency().data;
  let { data, error, loading, refetch } = useQuery<GetHighestPrice>(
    GET_HIGHEST_PRICE,
    {
      variables: { presentmentCurrencies: currentCurrency },
      ...otherOptions,
      onCompleted: ({ products }) => {
        let formattedPrice = Math.ceil(
          Number(
            products.edges[0].node.presentmentPriceRanges.edges[0].node
              .maxVariantPrice.amount,
          ),
        );
        onCompleted(formattedPrice);
      },
    },
  );

  let formattedPrice = Math.ceil(
    Number(
      data?.products.edges[0].node.presentmentPriceRanges.edges[0].node
        .maxVariantPrice.amount,
    ),
  );

  return { formattedPrice, error, loading, refetch };
}

export { useGetHighestPrice };
