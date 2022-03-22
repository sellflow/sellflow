import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from '@apollo/react-hooks';

import { GetAuthenticatedUser } from '../../generated/client/GetAuthenticatedUser';
import {
  SetAuthenticatedUser,
  SetAuthenticatedUserVariables,
} from '../../generated/client/SetAuthenticatedUser';
import {
  InitiatePasswordReset,
  InitiatePasswordResetVariables,
} from '../../generated/server/InitiatePasswordReset';
import {
  GET_AUTHENTICATED_USER,
  SET_AUTHENTICATED_USER,
} from '../../graphql/client/clientQueries';
import { INITIATE_PASSWORD_RESET } from '../../graphql/server/auth';

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
  let { data, error, loading, refetch } = useQuery<GetAuthenticatedUser>(
    GET_AUTHENTICATED_USER,
    {
      fetchPolicy: 'cache-only',
      notifyOnNetworkStatusChange: true,
      ...options,
    },
  );
  return { data, error, loading, refetch };
}

function useForgotPasswordMutation(
  options?: MutationHookOptions<
    InitiatePasswordReset,
    InitiatePasswordResetVariables
  >,
) {
  let [resetPassword, { loading }] = useMutation<
    InitiatePasswordReset,
    InitiatePasswordResetVariables
  >(INITIATE_PASSWORD_RESET, {
    ...options,
  });

  return { resetPassword, loading };
}

export {
  useSetAuthenticatedUser,
  useGetAuthenticatedUser,
  useForgotPasswordMutation,
};
