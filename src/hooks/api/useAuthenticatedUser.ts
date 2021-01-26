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
import {
  InitiatePasswordReset,
  InitiatePasswordResetVariables,
} from '../../generated/server/InitiatePasswordReset';
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
  let { loading, data } = useQuery<GetAuthenticatedUser>(
    GET_AUTHENTICATED_USER,
    {
      fetchPolicy: 'cache-only',
      notifyOnNetworkStatusChange: true,
      ...options,
    },
  );
  return { data, loading };
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
