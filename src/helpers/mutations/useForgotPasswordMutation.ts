import { useMutation, MutationHookOptions } from '@apollo/react-hooks';

import {
  InitiatePasswordReset,
  InitiatePasswordResetVariables,
} from '../../generated/server/InitiatePasswordReset';
import { INITIATE_PASSWORD_RESET } from '../../graphql/server/auth';

export function useForgotPasswordMutation(
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
