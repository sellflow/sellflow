import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { SetAuthenticatedUserVariables } from '../../generated/client/SetAuthenticatedUser';

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
