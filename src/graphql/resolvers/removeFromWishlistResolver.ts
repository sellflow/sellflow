import { ApolloCache } from 'apollo-cache';

import { GET_WISHLIST } from '../client/clientQueries';
import { LocalCache } from '../../types/types';
import { GetWishlist } from '../../generated/client/GetWishlist';
import { RemoveFromWishlistVariables } from '../../generated/client/RemoveFromWishlist';

function removeFromWishlistResolver(
  _: object,
  args: RemoveFromWishlistVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { productHandle } = args;

  let wishlistData = cache.readQuery<GetWishlist>({
    query: GET_WISHLIST,
  });

  let newWishlist = wishlistData
    ? wishlistData.wishlist.filter((item) => item.handle !== productHandle)
    : [];

  cache.writeData({
    data: {
      wishlist: newWishlist,
    },
  });

  return null;
}

export { removeFromWishlistResolver };
