import { ApolloCache } from 'apollo-cache';

import { SetDefaultCurrencyVariables } from '../../generated/client/SetDefaultCurrency';
import { LocalCache } from '../../types/types';

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
