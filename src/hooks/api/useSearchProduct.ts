import { useEffect, useRef, useState } from 'react';

import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import {
  SetRecentSearch,
  SetRecentSearchVariables,
} from '../../generated/client/SetRecentSearch';
import {
  SearchResults,
  SearchResultsVariables,
} from '../../generated/server/SearchResults';
import {
  GET_RECENT_SEARCH,
  SET_RECENT_SEARCH,
} from '../../graphql/client/clientQueries';
import { SEARCH_RESULTS } from '../../graphql/server/searchProduct';
import mapToProducts from '../../helpers/mapToProducts';
import { Product } from '../../types/types';

export default function getProducts(
  searchData: SearchResults | undefined,
): Array<Product> {
  if (searchData) {
    return mapToProducts(searchData.products);
  }
  return [];
}

function useSearchProductsQuery() {
  let [results, setResults] = useState<Array<Product>>([]);
  let [isSearching, setIsSearching] = useState(true);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let [
    searchProducts,
    { data, loading, refetch: refetchQuery, error },
  ] = useLazyQuery<SearchResults, SearchResultsVariables>(SEARCH_RESULTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  let refetch = async (
    type: 'update' | 'scroll',
    variables?: SearchResultsVariables,
  ) => {
    setIsSearching(false);
    isFetchingMore.current = type === 'scroll';
    let { data } = await refetchQuery(variables);
    let moreResults = mapToProducts(data.products);
    hasMore.current = !!data.products.pageInfo.hasNextPage;

    if (type === 'update') {
      setResults(moreResults);
    } else {
      setResults([...results, ...moreResults]);
    }
  };

  useEffect(() => {
    if (!loading && !isSearching) {
      isFetchingMore.current = false;
      setIsSearching(true);
    }
    if (isSearching && !!data) {
      let products = mapToProducts(data.products);
      hasMore.current = !!data.products.pageInfo.hasNextPage;

      setResults(products);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchProducts,
    results,
    loading,
    refetch,
    isFetchingMore: isFetchingMore.current,
    hasMore: hasMore.current,
    error,
  };
}

function useGetRecentSearch() {
  let { data, error, loading, refetch } = useQuery(GET_RECENT_SEARCH);
  return { data, error, loading, refetch };
}

function useSetRecentSearch() {
  let [setRecentSearch, { data, loading }] = useMutation<
    SetRecentSearch,
    SetRecentSearchVariables
  >(SET_RECENT_SEARCH);
  return { setRecentSearch, data, loading };
}

export { useSearchProductsQuery, useGetRecentSearch, useSetRecentSearch };
