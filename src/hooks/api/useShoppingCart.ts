import {
  useMutation,
  MutationHookOptions,
  useQuery,
  QueryHookOptions,
} from '@apollo/react-hooks';

import { ResetShoppingCart } from '../../generated/client/ResetShoppingCart';
import {
  RESET_SHOPPING_CART,
  ADD_TO_SHOPPING_CART,
  GET_SHOPPING_CART,
  SET_SHOPPING_CART_ID,
  SET_SHOPPING_CART,
} from '../../graphql/client/shoppingCartQueries';
import {
  AddToShoppingCartVariables,
  AddToShoppingCart,
} from '../../generated/client/AddToShoppingCart';
import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import {
  SetShoppingCartID,
  SetShoppingCartIDVariables,
} from '../../generated/client/SetShoppingCartID';
import {
  SetShoppingCart,
  SetShoppingCartVariables,
} from '../../generated/client/SetShoppingCart';

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

function useGetCart(options?: QueryHookOptions<GetShoppingCart>) {
  let { data, loading } = useQuery<GetShoppingCart>(GET_SHOPPING_CART, {
    ...options,
  });
  return { data, loading };
}

function useSetShoppingCartID() {
  let [setShoppingCartID, { loading }] = useMutation<
    SetShoppingCartID,
    SetShoppingCartIDVariables
  >(SET_SHOPPING_CART_ID);
  return { setShoppingCartID, loading };
}
function useSetShoppingCart() {
  let [setShoppingCart, { loading }] = useMutation<
    SetShoppingCart,
    SetShoppingCartVariables
  >(SET_SHOPPING_CART);
  return { setShoppingCart, loading };
}

export {
  useResetCart,
  useAddToCart,
  useGetCart,
  useSetShoppingCart,
  useSetShoppingCartID,
};
