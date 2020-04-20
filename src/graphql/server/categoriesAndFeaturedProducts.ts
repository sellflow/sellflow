import gql from 'graphql-tag';

export const GET_FEATURED_PRODUCTS_AND_CATEGORIES = gql`
  query GetFeaturedProductsAndCategories(
    $presentmentCurrencies: [CurrencyCode!]
    $first: Int!
    $after: String
  ) {
    collections(first: 250) {
      edges {
        cursor
        node {
          image {
            transformedSrc
          }
          handle
          id
          title
        }
      }
      pageInfo {
        hasNextPage
      }
    }
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          handle
          availableForSale
          productType
          presentmentPriceRanges(
            first: 1
            presentmentCurrencies: $presentmentCurrencies
          ) {
            edges {
              node {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
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
    }
  }
`;
