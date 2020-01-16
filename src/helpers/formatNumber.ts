import { LOCALE } from './translate';

const thousandsBoundary = /\B(?=(\d{3})+(?!\d))/g;
const exampleNum = 3.45;

// Wrap this in a function for testing.
export function createFormatter(locale: string = LOCALE) {
  const formatNumber = (value: number, numDecimalPlaces = 0) => {
    let decimalSep;
    let thousandsSep;
    if (exampleNum.toLocaleString(locale).includes('.')) {
      decimalSep = '.';
      thousandsSep = ',';
    } else {
      decimalSep = ',';
      thousandsSep = '.';
    }
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
