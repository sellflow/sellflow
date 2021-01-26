import { useMutation, QueryHookOptions, useQuery } from '@apollo/react-hooks';

import {
  AddToWishlist,
  AddToWishlistVariables,
} from '../../generated/client/AddToWishlist';
import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  GET_WISHLIST,
} from '../../graphql/client/clientQueries';
import {
  RemoveFromWishlist,
  RemoveFromWishlistVariables,
} from '../../generated/client/RemoveFromWishlist';
import { GetWishlist } from '../../generated/client/GetWishlist';

function useAddItemToWishlist() {
  let [addToWishlist, { loading }] = useMutation<
    AddToWishlist,
    AddToWishlistVariables
  >(ADD_TO_WISHLIST);
  return { addToWishlist, loading };
}

function useRemoveItemFromWishlist() {
  let [removeFromWishlist, { loading }] = useMutation<
    RemoveFromWishlist,
    RemoveFromWishlistVariables
  >(REMOVE_FROM_WISHLIST);

  return { removeFromWishlist, loading };
}

function useGetWishlistData(options?: QueryHookOptions<GetWishlist>) {
  let { data, loading } = useQuery<GetWishlist>(GET_WISHLIST, {
    ...options,
  });
  return { data, loading };
}

export { useAddItemToWishlist, useRemoveItemFromWishlist, useGetWishlistData };
