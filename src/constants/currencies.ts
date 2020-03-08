import currencies from './i18n/currencies.json';

type Currency = {
  code: string;
  symbol: string;
  decimalDigits: number;
};

type CurrencyList = {
  [key: string]: Currency;
};

export const CURRENCIES: CurrencyList = currencies;

export const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  symbol: '$',
  decimalDigits: 2,
};
