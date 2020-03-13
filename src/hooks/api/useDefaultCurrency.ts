import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  GET_DEFAULT_CURRENCY,
  SET_DEFAULT_CURRENCY,
} from '../../graphql/client/clientQueries';
import { GetDefaultCurrency } from '../../generated/client/GetDefaultCurrency';
import { CurrencyCode } from '../../generated/server/globalTypes';
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

  let defaultCurrency = shopData?.shop.paymentSettings.currencyCode || 'USD';
  let selectedCurrency = data?.defaultCurrency.currency || defaultCurrency;

  let [setDefaultCurrency] = useMutation<
    SetDefaultCurrency,
    SetDefaultCurrencyVariables
  >(SET_DEFAULT_CURRENCY);

  useEffect(() => {
    if (!selectedCurrency) {
      setDefaultCurrency({
        variables: {
          currency: defaultCurrency,
        },
      });
    }
  }, [selectedCurrency, defaultCurrency]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    setDefaultCurrency,
    data: selectedCurrency as CurrencyCode,
    loading,
    refetch,
    error,
  };
}
