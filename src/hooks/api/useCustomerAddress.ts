import { useMutation, MutationHookOptions } from '@apollo/react-hooks';

import {
  CustomerAddressDelete,
  CustomerAddressDeleteVariables,
} from '../../generated/server/CustomerAddressDelete';
import { CUSTOMER_ADDRESS_DELETE } from '../../graphql/server/customerAddress';

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

export { useCustomerAddressDelete };
