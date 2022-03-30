import decimalCurrencies from './i18n/decimal_currencies.json';

type DecimalCurrencyList = {
  [key: string]: number;
};

export const DECIMAL_CURRENCIES: DecimalCurrencyList = decimalCurrencies;
