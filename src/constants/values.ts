import { dataError, noInternetError } from '../../assets/images';

export const PRODUCT_SORT_VALUES = {
  POPULARITY: t('Popularity'),
  PRICE_LOW_TO_HIGH: t('Price from Low to High'),
  PRICE_HIGH_TO_LOW: t('Price from High to Low'),
};

export const ERRORS = {
  noInternet: {
    title: t('No Internet Connection'),
    message: t('Please check your internet settings and try again later'),
    image: noInternetError,
  },
  data: {
    title: t('Something Went Wrong'),
    message: t(
      'We encounter some error while processing your request. Please try again later',
    ),
    image: dataError,
  },
};
