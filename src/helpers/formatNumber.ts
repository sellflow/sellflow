import { LOCALE } from './translate';

const thousandsBoundary = /\B(?=(\d{3})+(?!\d))/g;
const exampleNum = 3.45;

export function getSeparators(locale: string) {
  let decimalSep;
  let thousandsSep;
  if (exampleNum.toLocaleString(locale).includes('.')) {
    decimalSep = '.';
    thousandsSep = ',';
  } else {
    decimalSep = ',';
    thousandsSep = '.';
  }
  return { decimalSep, thousandsSep };
}

// Wrap this in a function for testing.
export function createFormatter(locale: string = LOCALE) {
  let { decimalSep, thousandsSep } = getSeparators(locale);
  const formatNumber = (value: number, numDecimalPlaces = 0) => {
    let [whole, frac] = value.toFixed(numDecimalPlaces).split('.');
    let result = whole.replace(thousandsBoundary, thousandsSep);
    if (frac) {
      result += decimalSep + frac;
    }
    return result;
  };
  return formatNumber;
}

export default createFormatter();
