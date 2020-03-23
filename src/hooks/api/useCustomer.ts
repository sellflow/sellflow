import { useState, useRef, useEffect } from 'react';
import {
  useMutation,
  MutationHookOptions,
  useLazyQuery,
  QueryHookOptions,
  useQuery,
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
  GET_CUSTOMER_ADDRESSES,
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
import { AddressItem } from '../../types/types';
import {
  GetCustomerAddresses,
  GetCustomerAddressesVariables,
} from '../../generated/server/GetCustomerAddresses';

function getCustomerAddresses(
  customerAddressData: GetCustomerAddresses | undefined,
): Array<AddressItem> {
  let oldAddressData = customerAddressData?.customer?.addresses;
  let defaultAddress = customerAddressData?.customer?.defaultAddress;

  if (oldAddressData) {
    return oldAddressData.edges.map(
      (item): AddressItem => {
        let address = item.node;
        let { firstName, lastName } = address;
        return {
          id: address.id,
          cursor: item.cursor,
          name: address.name ?? '',
          firstName: firstName ?? '',
          lastName: lastName ?? '',
          address1: address.address1 ?? '',
          country: address.country ?? '',
          province: address.province ?? '',
          city: address.city ?? '',
          zip: address.zip ?? '',
          phone: address.phone ?? '',
          default: address.id === defaultAddress?.id,
        };
      },
    );
  } else {
    return [];
  }
}

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
  let [getCustomer, { data, loading }] = useLazyQuery<
    GetCustomerData,
    GetCustomerDataVariables
  >(GET_CUSTOMER_DATA, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    ...options,
  });

  return {
    getCustomer,
    data,
    loading,
  };
}

function useGetCustomerAddresses(
  first: number,
  customerAccessToken: string,
  options?: QueryHookOptions<
    GetCustomerAddresses,
    GetCustomerAddressesVariables
  >,
) {
  let [isInitFetching, setInitFetching] = useState<boolean>(true);
  let [addresses, setAddresses] = useState<Array<AddressItem>>([]);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let { data, loading, refetch: refetchQuery } = useQuery<
    GetCustomerAddresses,
    GetCustomerAddressesVariables
  >(GET_CUSTOMER_ADDRESSES, {
    variables: {
      first,
      customerAccessToken,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    ...options,
  });

  let refetch = async (
    type: 'update' | 'scroll',
    variables: GetCustomerAddressesVariables | undefined,
  ) => {
    isFetchingMore.current = type === 'scroll';
    let { data } = await refetchQuery(variables);
    let moreAddress = getCustomerAddresses(data);

    if (type === 'update') {
      setAddresses(moreAddress);
    } else {
      hasMore.current = !!data.customer?.addresses.pageInfo.hasNextPage;
      setAddresses([...addresses, ...moreAddress]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let newAddresses = getCustomerAddresses(data);
      hasMore.current = !!data.customer?.addresses.pageInfo.hasNextPage;

      setAddresses(newAddresses);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    addresses,
    loading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
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
  useGetCustomerAddresses,
};
