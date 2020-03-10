import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';

import { Product } from '../../types/types';
import { SEARCH_RESULTS } from '../../graphql/server/searchProduct';
import {
  GET_RECENT_SEARCH,
  SET_RECENT_SEARCH,
} from '../../graphql/client/clientQueries';
import {
  SetRecentSearch,
  SetRecentSearchVariables,
} from '../../generated/client/SetRecentSearch';
import {
  SearchResults,
  SearchResultsVariables,
} from '../../generated/server/SearchResults';
import useDefaultCurrency from './useDefaultCurrency';
import { CurrencyCode } from '../../generated/server/globalTypes';
import { getDiscount } from '../../helpers/getDiscount';

export default function getProducts(
  searchData: SearchResults | undefined,
): Array<Product> {
  if (searchData) {
    return searchData.products.edges.map((item) => {
      let product = item.node;

      let originalProductPrice = ~~product.variants.edges[0].node
        .presentmentPrices.edges[0].node.compareAtPrice?.amount;

      let productPrice = ~~product.variants.edges[0].node.presentmentPrices
        .edges[0].node.price.amount;

      let { price, discount } = getDiscount(originalProductPrice, productPrice);

      return {
        id: product.id,
        cursor: item.cursor,
        images: [product.images.edges[0].node.transformedSrc],
        title: product.title,
        productType: product.productType,
        price: price,
        discount: discount,
        handle: product.handle,
        url: product.onlineStoreUrl,
      };
    });
  }
  return [];
}

function useSearchProductsQuery() {
  let defaultCurrency = useDefaultCurrency().data;
  let currency: keyof typeof CurrencyCode = defaultCurrency;

  let [searchProducts, { data: resultsData, loading, refetch }] = useLazyQuery<
    SearchResults,
    SearchResultsVariables
  >(SEARCH_RESULTS, {
    variables: {
      searchText: '',
      presentmentCurrencies: [CurrencyCode[currency]],
    },
  });
  let data = getProducts(resultsData);
  return { searchProducts, data, loading, refetch };
}

function useGetRecentSearch() {
  let { data, loading, refetch } = useQuery(GET_RECENT_SEARCH);
  return { data, loading, refetch };
}

function useSetRecentSearch() {
  let [setRecentSearch, { data, loading }] = useMutation<
    SetRecentSearch,
    SetRecentSearchVariables
  >(SET_RECENT_SEARCH);
  return { setRecentSearch, data, loading };
}

export { useSearchProductsQuery, useGetRecentSearch, useSetRecentSearch };
