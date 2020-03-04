import gql from 'graphql-tag';

export const GET_CATEGORIES_AND_FEATURED_PRODUCTS = gql`
  query GetCategoriesAndFeaturedProducts(
    $presentmentCurrencies: [CurrencyCode!]
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
    products(first: 10) {
      edges {
        cursor
        node {
          id
          title
          handle
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
