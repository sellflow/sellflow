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
import mapToProducts from '../../helpers/mapToProducts';

export default function getProducts(
  searchData: SearchResults | undefined,
): Array<Product> {
  if (searchData) {
    return mapToProducts(searchData.products);
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
