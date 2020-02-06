import { useMutation } from '@apollo/react-hooks';

import {
  AddToWishlist,
  AddToWishlistVariables,
} from '../../generated/client/AddToWishlist';
import { ADD_TO_WISHLIST } from '../../graphql/client/clientQueries';

export function useAddToWishlistMutation() {
  let [addToWishlist, { loading }] = useMutation<
    AddToWishlist,
    AddToWishlistVariables
  >(ADD_TO_WISHLIST);

  return { addToWishlist, loading };
}
