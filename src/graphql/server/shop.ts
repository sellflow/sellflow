import gql from 'graphql-tag';

export const GET_SHOP = gql`
  query GetShop {
    shop {
      name
      privacyPolicy {
        id
        title
        url
      }
      termsOfService {
        id
        title
        url
      }
      paymentSettings {
        acceptedCardBrands
        cardVaultUrl
        countryCode
        currencyCode
        enabledPresentmentCurrencies
        supportedDigitalWallets
        shopifyPaymentsAccountId
      }
      shipsToCountries
      moneyFormat
      description
    }
  }
`;
