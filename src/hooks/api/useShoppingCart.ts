import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from '@apollo/react-hooks';

import {
  AddToShoppingCart,
  AddToShoppingCartVariables,
} from '../../generated/client/AddToShoppingCart';
import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import { ResetShoppingCart } from '../../generated/client/ResetShoppingCart';
import {
  SetShoppingCart,
  SetShoppingCartVariables,
} from '../../generated/client/SetShoppingCart';
import {
  SetShoppingCartID,
  SetShoppingCartIDVariables,
} from '../../generated/client/SetShoppingCartID';
import {
  ADD_TO_SHOPPING_CART,
  GET_SHOPPING_CART,
  RESET_SHOPPING_CART,
  SET_SHOPPING_CART,
  SET_SHOPPING_CART_ID,
} from '../../graphql/client/shoppingCartQueries';

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
  let { data, error, loading, refetch } = useQuery<GetShoppingCart>(
    GET_SHOPPING_CART,
    {
      ...options,
    },
  );
  return { data, error, loading, refetch };
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
