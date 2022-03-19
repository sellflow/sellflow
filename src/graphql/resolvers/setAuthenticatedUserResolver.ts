import { ApolloCache } from 'apollo-cache';

import { SetAuthenticatedUserVariables } from '../../generated/client/SetAuthenticatedUser';
import { LocalCache } from '../../types/types';

function setAuthenticatedUserResolver(
  _: object,
  args: SetAuthenticatedUserVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { user } = args;

  cache.writeData({
    data: {
      authenticatedUser: {
        __typename: 'AuthenticatedUser',
        ...user,
      },
    },
  });

  return null;
}

export { setAuthenticatedUserResolver };
