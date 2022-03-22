import { QueryHookOptions, useMutation, useQuery } from '@apollo/react-hooks';

import {
  AddToWishlist,
  AddToWishlistVariables,
} from '../../generated/client/AddToWishlist';
import { GetWishlist } from '../../generated/client/GetWishlist';
import {
  RemoveFromWishlist,
  RemoveFromWishlistVariables,
} from '../../generated/client/RemoveFromWishlist';
import {
  ADD_TO_WISHLIST,
  GET_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from '../../graphql/client/clientQueries';

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
  let { data, error, loading, refetch } = useQuery<GetWishlist>(GET_WISHLIST, {
    ...options,
  });
  return { data, error, loading, refetch };
}

export { useAddItemToWishlist, useRemoveItemFromWishlist, useGetWishlistData };
