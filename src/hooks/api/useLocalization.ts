import { useQuery } from '@apollo/react-hooks';
import { GetLocalization } from '../../generated/server/GetLocalization';

import { GET_LOCALIZATION } from '../../graphql/server/localization';

export default function useLocalization() {
  let { data, loading } = useQuery<GetLocalization>(GET_LOCALIZATION);

  return {
    data,
    loading,
  };
}
