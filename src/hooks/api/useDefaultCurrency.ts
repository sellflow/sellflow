import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  GET_DEFAULT_CURRENCY,
  SET_DEFAULT_CURRENCY,
} from '../../graphql/client/clientQueries';
import { GetDefaultCurrency } from '../../generated/client/GetDefaultCurrency';
import {
  SetDefaultCurrency,
  SetDefaultCurrencyVariables,
} from '../../generated/client/SetDefaultCurrency';
import { GetShop } from '../../generated/server/GetShop';
import { GET_SHOP } from '../../graphql/server/shop';

export default function useDefaultCurrency() {
  let { data: shopData } = useQuery<GetShop>(GET_SHOP);

  let { data, loading, refetch, error } = useQuery<GetDefaultCurrency>(
    GET_DEFAULT_CURRENCY,
  );

  let defaultCurrency = data?.defaultCurrency.currency;
  let firstCurrency =
    shopData?.shop.paymentSettings.enabledPresentmentCurrencies[0] || '';

  let [setDefaultCurrency] = useMutation<
    SetDefaultCurrency,
    SetDefaultCurrencyVariables
  >(SET_DEFAULT_CURRENCY);

  useEffect(() => {
    if (!defaultCurrency) {
      setDefaultCurrency({
        variables: {
          currency: firstCurrency,
        },
      });
    }
  }, [defaultCurrency, firstCurrency, setDefaultCurrency]);

  return { setDefaultCurrency, data: defaultCurrency, loading, refetch, error };
}
