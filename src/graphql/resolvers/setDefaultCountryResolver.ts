import { ApolloCache } from 'apollo-cache';

import { SetDefaultCountryVariables } from '../../generated/client/SetDefaultCountry';
import { LocalCache } from '../../types/types';

function setDefaultCountryResolver(
  _: object,
  args: SetDefaultCountryVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { countryCode, currencyCode, currencySymbol } = args;

  cache.writeData({
    data: {
      defaultCountry: {
        __typename: 'DefaultCountry',
        countryCode,
        currencyCode,
        currencySymbol,
      },
    },
  });

  return null;
}

export { setDefaultCountryResolver };
