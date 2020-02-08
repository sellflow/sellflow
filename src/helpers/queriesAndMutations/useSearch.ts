import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  GET_RECENT_SEARCH,
  SET_RECENT_SEARCH,
} from '../../graphql/client/clientQueries';
import {
  SetRecentSearch,
  SetRecentSearchVariables,
} from '../../generated/client/SetRecentSearch';

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

export { useGetRecentSearch, useSetRecentSearch };
