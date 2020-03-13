import gql from 'graphql-tag';

export const GET_CATEGORIES_AND_FEATURED_PRODUCTS = gql`
  query GetCategoriesAndFeaturedProducts(
    $presentmentCurrencies: [CurrencyCode!]
    $first: Int!
    $after: String
  ) {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
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
