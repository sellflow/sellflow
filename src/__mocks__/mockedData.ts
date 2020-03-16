import { GET_DEFAULT_CURRENCY } from '../graphql/client/clientQueries';
import { GET_SHOP } from '../graphql/server/shop';

export const MOCKED_SHOP = [
  {
    request: {
      query: GET_SHOP,
    },
    result: {
      data: {
        shop: {
          name: 'Ivory Outfitters',
          privacyPolicy: null,
          termsOfService: null,
          paymentSettings: {
            acceptedCardBrands: [
              'VISA',
              'MASTERCARD',
              'AMERICAN_EXPRESS',
              'DISCOVER',
              'JCB',
              'DINERS_CLUB',
            ],
            cardVaultUrl: 'https://elb.deposit.shopifycs.com/sessions',
            countryCode: 'US',
            currencyCode: 'USD',
            enabledPresentmentCurrencies: ['CAD', 'USD', 'EUR', 'IDR'],
            supportedDigitalWallets: ['SHOPIFY_PAY', 'GOOGLE_PAY'],
            shopifyPaymentsAccountId: null,
          },
          shipsToCountries: ['US'],
          moneyFormat: '${{amount}}',
          description: '',
        },
      },
    },
  },
  {
    request: {
      query: GET_DEFAULT_CURRENCY,
    },
    result: {
      data: {
        defaultCurrency: {
          currency: 'USD',
        },
      },
    },
  },
];
