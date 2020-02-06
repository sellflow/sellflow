import { useQuery, QueryHookOptions } from '@apollo/react-hooks';

import { GetWishlist } from '../../generated/client/GetWishlist';
import { GET_WISHLIST } from '../../graphql/client/clientQueries';

export function useWishlistQuery(options?: QueryHookOptions<GetWishlist>) {
  let { loading, data } = useQuery<GetWishlist>(GET_WISHLIST, options);

  return { data, loading };
}
