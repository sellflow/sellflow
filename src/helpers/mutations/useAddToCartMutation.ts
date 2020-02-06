import { useMutation } from '@apollo/react-hooks';

import {
  AddToShoppingCart,
  AddToShoppingCartVariables,
} from '../../generated/client/AddToShoppingCart';
import { ADD_TO_SHOPPING_CART } from '../../graphql/client/shoppingCartQueries';

export function useAddToCartMutation() {
  let [addToCart, { loading }] = useMutation<
    AddToShoppingCart,
    AddToShoppingCartVariables
  >(ADD_TO_SHOPPING_CART);

  return { addToCart, loading };
}
