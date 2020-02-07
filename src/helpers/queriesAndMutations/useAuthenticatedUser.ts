import {
  useMutation,
  useQuery,
  MutationHookOptions,
  QueryHookOptions,
} from '@apollo/react-hooks';

import {
  SetAuthenticatedUser,
  SetAuthenticatedUserVariables,
} from '../../generated/client/SetAuthenticatedUser';

import {
  SET_AUTHENTICATED_USER,
  GET_AUTHENTICATED_USER,
} from '../../graphql/client/clientQueries';

import { GetAuthenticatedUser } from '../../generated/client/GetAuthenticatedUser';

function useSetAuthenticatedUser(
  options?: MutationHookOptions<
    SetAuthenticatedUser,
    SetAuthenticatedUserVariables
  >,
) {
  let [setUser, { loading }] = useMutation<
    SetAuthenticatedUser,
    SetAuthenticatedUserVariables
  >(SET_AUTHENTICATED_USER, { ...options });

  return { setUser, loading };
}

function useGetAuthenticatedUser(
  options?: QueryHookOptions<GetAuthenticatedUser>,
) {
  let { loading, data: authenticatedUser } = useQuery<GetAuthenticatedUser>(
    GET_AUTHENTICATED_USER,
    {
      ...options,
    },
  );
  return { authenticatedUser, loading };
}

export { useSetAuthenticatedUser, useGetAuthenticatedUser };
