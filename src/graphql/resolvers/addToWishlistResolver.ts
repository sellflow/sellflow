import { ApolloCache } from 'apollo-cache';

import { AddToWishlistVariables } from '../../generated/client/AddToWishlist';
import { GET_WISHLIST } from '../client/clientQueries';
import { LocalCache } from '../../types/types';
import { GetWishlist } from '../../generated/client/GetWishlist';

function addToWishlistResolver(
  _: object,
  args: AddToWishlistVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { product } = args;

  let newWishlistProduct = {
    __typename: 'WishlistProduct',
    ...product,
  };

  let wishlistData = cache.readQuery<GetWishlist>({
    query: GET_WISHLIST,
  });

  let wishlist = wishlistData ? wishlistData.wishlist : [];

  cache.writeData({
    data: {
      wishlist: [...wishlist, newWishlistProduct],
    },
  });

  return null;
}

export { addToWishlistResolver };
