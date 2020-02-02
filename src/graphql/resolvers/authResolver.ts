import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { SetCustomerVariables } from '../../generated/client/SetCustomer';

function authResolver(
  _: object,
  args: SetCustomerVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { customer } = args;

  cache.writeData({
    data: {
      customer: {
        __typename: 'Customer',
        ...customer,
      },
    },
  });

  return null;
}

export { authResolver };
