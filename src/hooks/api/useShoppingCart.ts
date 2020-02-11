import { useMutation, MutationHookOptions } from '@apollo/react-hooks';

import { ResetShoppingCart } from '../../generated/client/ResetShoppingCart';
import {
  RESET_SHOPPING_CART,
  ADD_TO_SHOPPING_CART,
} from '../../graphql/client/shoppingCartQueries';
import {
  AddToShoppingCartVariables,
  AddToShoppingCart,
} from '../../generated/client/AddToShoppingCart';

function useResetCart() {
  let [resetShoppingCart, { loading }] = useMutation<ResetShoppingCart>(
    RESET_SHOPPING_CART,
  );
  return { resetShoppingCart, loading };
}

function useAddToCart(
  options?: MutationHookOptions<AddToShoppingCart, AddToShoppingCartVariables>,
) {
  let [addToCart, { loading }] = useMutation<
    AddToShoppingCart,
    AddToShoppingCartVariables
  >(ADD_TO_SHOPPING_CART, { ...options });
  return { addToCart, loading };
}

export { useResetCart, useAddToCart };
