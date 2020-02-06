import { useMutation } from '@apollo/react-hooks';

import {
  RemoveFromWishlist,
  RemoveFromWishlistVariables,
} from '../../generated/client/RemoveFromWishlist';
import { REMOVE_FROM_WISHLIST } from '../../graphql/client/clientQueries';

export function useRemoveFromWishlistMutation() {
  let [removeFromWishlist, { loading }] = useMutation<
    RemoveFromWishlist,
    RemoveFromWishlistVariables
  >(REMOVE_FROM_WISHLIST);

  return { removeFromWishlist, loading };
}
