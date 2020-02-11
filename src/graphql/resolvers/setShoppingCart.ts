import { ApolloCache } from 'apollo-cache';
import { LocalCache } from '../../types/types';
import { SetShoppingCartVariables } from '../../generated/client/SetShoppingCart';
import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import { GET_SHOPPING_CART } from '../client/shoppingCartQueries';

function setShoppingCartResolver(
  _: object,
  args: SetShoppingCartVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { items } = args;

  let newItems = items.map((item) => {
    return { ...item, __typename: 'LineItem' };
  });

  let cartData = cache.readQuery<GetShoppingCart>({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  cache.writeData({
    data: {
      shoppingCart: {
        __typename: 'ShoppingCart',
        id: cartData.shoppingCart.id,
        items: newItems,
      },
    },
  });

  return null;
}

export { setShoppingCartResolver };
