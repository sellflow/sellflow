import gql from 'graphql-tag';

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory(
    $customerAccessToken: String!
    $first: Int!
    $after: String
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: $first, after: $after) {
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
            lineItems(first: 20) {
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
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      originalSrc
                      transformedSrc
                    }
                    compareAtPriceV2 {
                      amount
                    }
                    priceV2 {
                      amount
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
