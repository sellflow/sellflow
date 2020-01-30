import { ApolloCache } from 'apollo-cache';
import { SetCustomerVariables } from '../../generated/client/SetCustomer';
import { CachedData } from '../../types/types';

function authResolver(
  _: object,
  args: SetCustomerVariables,
  { cache }: { cache: ApolloCache<CachedData> },
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
