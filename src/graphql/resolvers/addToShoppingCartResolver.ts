import { ApolloCache } from 'apollo-cache';
import { LocalCache } from '../../types/types';
import { GET_SHOPPING_CART } from '../client/shoppingCartQueries';
import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import { AddToShoppingCartVariables } from '../../generated/client/AddToShoppingCart';

function addToShoppingCartResolver(
  _: object,
  args: AddToShoppingCartVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { quantity, variantId } = args;

  let cartData = cache.readQuery<GetShoppingCart>({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  let newItem = { __typename: 'LineItem', quantity, variantId };

  cache.writeData({
    data: {
      shoppingCart: {
        __typename: 'ShoppingCart',
        id: cartData.shoppingCart.id,
        items: [...cartData.shoppingCart.items, newItem],
      },
    },
  });

  return null;
}

export { addToShoppingCartResolver };
