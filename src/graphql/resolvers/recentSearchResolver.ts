import { ApolloCache } from 'apollo-cache';

import { GetRecentSearch } from '../../generated/client/GetRecentSearch';
import { GET_RECENT_SEARCH } from '../client/clientQueries';
import { SetRecentSearchVariables } from '../../generated/client/SetRecentSearch';

function recentSearchResolver(
  _: object,
  args: SetRecentSearchVariables,
  { cache }: { cache: ApolloCache<object> },
) {
  let { search } = args;

  let recentSearchData = cache.readQuery<GetRecentSearch>({
    query: GET_RECENT_SEARCH,
  });

  let same = recentSearchData?.recentSearch
    .map((item) => item.title === search)
    .indexOf(true);

  same !== -1
    ? cache.writeData({
        data: {
          __typename: 'RecentSearch',
          recentSearch: [
            ...(recentSearchData
              ? recentSearchData.recentSearch.filter(
                  (_, index) => index !== same,
                )
              : []),
            {
              __typename: 'SearchDetail',
              title: search,
            },
          ],
        },
      })
    : cache.writeData({
        data: {
          __typename: 'RecentSearch',
          recentSearch: [
            ...(recentSearchData
              ? recentSearchData.recentSearch.length > 4
                ? recentSearchData.recentSearch.slice(
                    Math.max(recentSearchData.recentSearch.length - 4, 1),
                  )
                : recentSearchData.recentSearch
              : []),
            {
              __typename: 'SearchDetail',
              title: search,
            },
          ],
        },
      });

  return null;
}

export { recentSearchResolver };
