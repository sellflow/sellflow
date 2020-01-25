import { ApolloCache } from 'apollo-cache';
import { SetLocalStateVariables } from '../../generated/client/SetLocalState';

function authResolver(
  _: object,
  args: SetLocalStateVariables,
  { cache }: { cache: ApolloCache<object> },
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
