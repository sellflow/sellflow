import { useQuery } from '@apollo/react-hooks';

import { GET_HIGHEST_PRICE } from '../../graphql/server/searchProduct';
import { GetHighestPrice } from '../../generated/server/GetHighestPrice';

import useDefaultCurrency from './useDefaultCurrency';

function useGetHighestPrice() {
  let currentCurrency = useDefaultCurrency().data;
  let { data } = useQuery<GetHighestPrice>(GET_HIGHEST_PRICE, {
    variables: { presentmentCurrencies: currentCurrency },
  });

  let formattedPrice = Math.ceil(
    Number(
      data?.products.edges[0].node.presentmentPriceRanges.edges[0].node
        .maxVariantPrice.amount,
    ),
  );

  return formattedPrice;
}

export { useGetHighestPrice };
