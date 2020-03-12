import {
  useMutation,
  MutationHookOptions,
  QueryHookOptions,
  useQuery,
} from '@apollo/react-hooks';

import {
  CustomerAddressDelete,
  CustomerAddressDeleteVariables,
} from '../../generated/server/CustomerAddressDelete';
import {
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_ADD_NEW_ADDRESS,
  CUSTOMER_EDIT_ADDRESS,
  CUSTOMER_SET_DEFAULT_ADDRESS,
} from '../../graphql/server/customerAddress';
import {
  CustomerAddNewAddress,
  CustomerAddNewAddressVariables,
} from '../../generated/server/CustomerAddNewAddress';
import {
  CustomerEditAddress,
  CustomerEditAddressVariables,
} from '../../generated/server/CustomerEditAddress';
import {
  CustomerSetDefaultAddress,
  CustomerSetDefaultAddressVariables,
} from '../../generated/server/CustomerSetDefaultAddress';
import { GetShop } from '../../generated/server/GetShop';
import { GET_SHOP } from '../../graphql/server/shop';

function useCustomerAddNewAddress(
  options?: MutationHookOptions<
    CustomerAddNewAddress,
    CustomerAddNewAddressVariables
  >,
) {
  let [addNewAddress, { loading }] = useMutation<
    CustomerAddNewAddress,
    CustomerAddNewAddressVariables
  >(CUSTOMER_ADD_NEW_ADDRESS, { ...options });

  return { addNewAddress, loading };
}

function useCustomerEditAddress(
  options?: MutationHookOptions<
    CustomerEditAddress,
    CustomerEditAddressVariables
  >,
) {
  let [editAddress, { loading }] = useMutation<
    CustomerEditAddress,
    CustomerEditAddressVariables
  >(CUSTOMER_EDIT_ADDRESS, {
    ...options,
  });

  return { editAddress, loading };
}

function useCustomerAddressDelete(
  options?: MutationHookOptions<
    CustomerAddressDelete,
    CustomerAddressDeleteVariables
  >,
) {
  let [customerAddressDelete, { loading }] = useMutation<
    CustomerAddressDelete,
    CustomerAddressDeleteVariables
  >(CUSTOMER_ADDRESS_DELETE, { ...options });

  return { customerAddressDelete, loading };
}

function useCustomerSetDefaultAddress(
  options?: MutationHookOptions<
    CustomerSetDefaultAddress,
    CustomerSetDefaultAddressVariables
  >,
) {
  let [setDefaultAddress, { loading }] = useMutation<
    CustomerSetDefaultAddress,
    CustomerSetDefaultAddressVariables
  >(CUSTOMER_SET_DEFAULT_ADDRESS, { ...options });

  return { setDefaultAddress, loading };
}

function useGetShop(options?: QueryHookOptions<GetShop>) {
  let { data, loading } = useQuery<GetShop>(GET_SHOP, {
    ...options,
    fetchPolicy: 'no-cache',
  });

  return { data, loading };
}

export {
  useCustomerAddNewAddress,
  useCustomerEditAddress,
  useCustomerAddressDelete,
  useCustomerSetDefaultAddress,
  useGetShop,
};
