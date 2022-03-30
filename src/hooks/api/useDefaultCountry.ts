import { useEffect } from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';

import { GetDefaultCountry } from '../../generated/client/GetDefaultCountry';
import {
  SetDefaultCountry,
  SetDefaultCountryVariables,
} from '../../generated/client/SetDefaultCountry';
import { CountryCode } from '../../generated/server/globalTypes';
import {
  GET_DEFAULT_COUNTRY,
  SET_DEFAULT_COUNTRY,
} from '../../graphql/client/clientQueries';
import useLocalization from './useLocalization';

export default function useDefaultCountry() {
  let { data: localizationData } = useLocalization();

  let { data, loading, refetch, error } = useQuery<GetDefaultCountry>(
    GET_DEFAULT_COUNTRY,
  );

  let initCountryCode = {
    countryCode: localizationData?.localization.country.isoCode || 'US',
    currencyCode:
      localizationData?.localization.country.currency.isoCode || 'USD',
    currencySymbol:
      localizationData?.localization.country.currency.symbol || '$',
  };

  let selectedCountryCode = {
    countryCode:
      data?.defaultCountry.countryCode || initCountryCode.countryCode,
    currencyCode:
      data?.defaultCountry.currencyCode || initCountryCode.currencyCode,
    currencySymbol:
      data?.defaultCountry.currencySymbol || initCountryCode.currencySymbol,
  };

  let [setDefaultCountryCode] = useMutation<
    SetDefaultCountry,
    SetDefaultCountryVariables
  >(SET_DEFAULT_COUNTRY);

  useEffect(() => {
    if (!selectedCountryCode) {
      setDefaultCountryCode({
        variables: initCountryCode,
      });
    }
  }, [selectedCountryCode, initCountryCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    setDefaultCountryCode,
    data: {
      countryCode: selectedCountryCode.countryCode as CountryCode,
      currencyCode: selectedCountryCode.currencyCode,
      currencySymbol: selectedCountryCode.currencySymbol,
    },
    loading,
    refetch,
    error,
  };
}
