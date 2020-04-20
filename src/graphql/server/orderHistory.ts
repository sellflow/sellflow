import gql from 'graphql-tag';

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory(
    $customerAccessToken: String!
    $first: Int!
    $after: String
    $currencyCode: [CurrencyCode!]
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(
        first: $first
        after: $after
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            orderNumber
            processedAt
            subtotalPriceV2 {
              amount
            }
            totalShippingPriceV2 {
              amount
            }
            totalPriceV2 {
              amount
            }
            shippingAddress {
              id
              name
              firstName
              lastName
              phone
              city
              province
              address1
              zip
              country
            }
            lineItems(first: 250) {
              edges {
                node {
                  discountAllocations {
                    allocatedAmount {
                      amount
                    }
                  }
                  title
                  quantity
                  variant {
                    id
                    quantityAvailable
                    presentmentPrices(
                      first: 1
                      presentmentCurrencies: $currencyCode
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
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      originalSrc
                      transformedSrc
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
