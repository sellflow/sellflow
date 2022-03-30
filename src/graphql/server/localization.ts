import gql from 'graphql-tag';

export const GET_LOCALIZATION = gql`
  query GetLocalization {
    localization {
      availableCountries {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
      country {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
    }
  }
`;
