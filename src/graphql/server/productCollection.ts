import gql from 'graphql-tag';

export const GET_COLLECTION = gql`
  query GetCollection(
    $collectionHandle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int!
    $after: String
    $presentmentCurrencies: [CurrencyCode!]
  ) {
    collectionByHandle(handle: $collectionHandle) {
      id
      title
      handle
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
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
  }
`;
