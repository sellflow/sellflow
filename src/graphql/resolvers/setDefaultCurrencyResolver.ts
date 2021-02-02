import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { SetDefaultCurrencyVariables } from '../../generated/client/SetDefaultCurrency';

function setDefaultCurrencyResolver(
  _: object,
  args: SetDefaultCurrencyVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { currency } = args;

  cache.writeData({
    data: {
      defaultCurrency: {
        __typename: 'DefaultCurrency',
        currency,
      },
    },
  });

  return null;
}

export { setDefaultCurrencyResolver };
