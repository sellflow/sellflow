import gql from 'graphql-tag';

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory(
    $customerAccessToken: String!
    $first: Int!
    $after: String
    $country: CountryCode!
  ) @inContext(country: $country) {
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
                    compareAtPriceV2 {
                      amount
                      currencyCode
                    }
                    priceV2 {
                      amount
                      currencyCode
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
