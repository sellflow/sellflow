import { useCallback } from 'react';
import { DECIMAL_CURRENCIES } from '../../constants/decimalCurrencies';

import formatNumber from '../../helpers/formatNumber';
import useDefaultCountry from './useDefaultCountry';

export default function useCurrencyFormatter() {
  let { data: selectedCountryCode } = useDefaultCountry();

  const formatCurrency = useCallback(
    (value: number) => {
      let { currencyCode, currencySymbol } = selectedCountryCode;
      let decimalDigit = DECIMAL_CURRENCIES[currencyCode] || 2;

      // TODO: Need to find a way to give decimal digits based on country
      return currencySymbol + formatNumber(value, decimalDigit);
    },
    [selectedCountryCode],
  );

  return formatCurrency;
}
