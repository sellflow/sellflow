import {
  useMutation,
  MutationHookOptions,
  useLazyQuery,
  QueryHookOptions,
} from '@apollo/react-hooks';

import {
  CustomerCreateToken,
  CustomerCreateTokenVariables,
} from '../../generated/server/CustomerCreateToken';

import {
  CUSTOMER_CREATE_TOKEN,
  GET_CUSTOMER_DATA,
  CUSTOMER_REGISTER,
  UPDATE_CUSTOMER_DATA,
  REMOVE_ACCESS_TOKEN,
} from '../../graphql/server/auth';
import {
  GetCustomerData,
  GetCustomerDataVariables,
} from '../../generated/server/GetCustomerData';
import {
  CustomerRegister,
  CustomerRegisterVariables,
} from '../../generated/server/CustomerRegister';
import {
  UpdateCustomerData,
  UpdateCustomerDataVariables,
} from '../../generated/server/UpdateCustomerData';
import {
  RemoveAccessToken,
  RemoveAccessTokenVariables,
} from '../../generated/server/RemoveAccessToken';

function useCustomerCreateToken(
  options?: MutationHookOptions<
    CustomerCreateToken,
    CustomerCreateTokenVariables
  >,
) {
  let [createToken, { loading }] = useMutation<
    CustomerCreateToken,
    CustomerCreateTokenVariables
  >(CUSTOMER_CREATE_TOKEN, { ...options });
  return { createToken, loading };
}

function useGetCustomerData(
  options?: QueryHookOptions<GetCustomerData, GetCustomerDataVariables>,
) {
  let [getCustomer, { data, loading, refetch }] = useLazyQuery<
    GetCustomerData,
    GetCustomerDataVariables
  >(GET_CUSTOMER_DATA, { ...options });

  return { getCustomer, data, loading, refetch };
}

function useCustomerRegister(
  options?: MutationHookOptions<CustomerRegister, CustomerRegisterVariables>,
) {
  let [register, { loading }] = useMutation<
    CustomerRegister,
    CustomerRegisterVariables
  >(CUSTOMER_REGISTER, { ...options });
  return { register, loading };
}

function useUpdateCustomer(
  options?: MutationHookOptions<
    UpdateCustomerData,
    UpdateCustomerDataVariables
  >,
) {
  let [updateCustomerData, { loading }] = useMutation<
    UpdateCustomerData,
    UpdateCustomerDataVariables
  >(UPDATE_CUSTOMER_DATA, { ...options });
  return { updateCustomerData, loading };
}

function useDeactivateCustomerToken(
  options: MutationHookOptions<RemoveAccessToken, RemoveAccessTokenVariables>,
) {
  let [deactivateCustomerToken, { loading }] = useMutation<
    RemoveAccessToken,
    RemoveAccessTokenVariables
  >(REMOVE_ACCESS_TOKEN, { ...options });
  return { deactivateCustomerToken, loading };
}

export {
  useCustomerCreateToken,
  useCustomerRegister,
  useGetCustomerData,
  useUpdateCustomer,
  useDeactivateCustomerToken,
};
