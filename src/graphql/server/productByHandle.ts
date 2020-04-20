import gql from 'graphql-tag';

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle(
    $productHandle: String!
    $presentmentCurrencies: [CurrencyCode!]
  ) {
    productByHandle(handle: $productHandle) {
      id
      title
      handle
      availableForSale
      description
      onlineStoreUrl
      options(first: 5) {
        name
        values
      }
      images(first: 5) {
        edges {
          node {
            id
            originalSrc
            transformedSrc
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            quantityAvailable
            presentmentPrices(
              first: 1
              presentmentCurrencies: $presentmentCurrencies
            ) {
              edges {
                node {
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_VARIANT = gql`
  query GetProductVariant(
    $selectedOptions: [SelectedOptionInput!]!
    $handle: String!
    $presentmentCurrencies: [CurrencyCode!]
  ) {
    productByHandle(handle: $handle) {
      id
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        quantityAvailable
        presentmentPrices(
          first: 1
          presentmentCurrencies: $presentmentCurrencies
        ) {
          edges {
            node {
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
