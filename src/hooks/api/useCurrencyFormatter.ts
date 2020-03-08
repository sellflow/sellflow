import useDefaultCurrency from './useDefaultCurrency';
import { CURRENCIES, DEFAULT_CURRENCY } from '../../constants/currencies';
import formatNumber from '../../helpers/formatNumber';
import { useCallback } from 'react';

export default function useCurrencyFormatter() {
  let { data: selectedCurrency } = useDefaultCurrency();

  const formatCurrency = useCallback(
    (value: number) => {
      let currency = CURRENCIES[selectedCurrency] || DEFAULT_CURRENCY;
      return currency.symbol + formatNumber(value, currency.decimalDigits);
    },
    [selectedCurrency],
  );

  return formatCurrency;
}
