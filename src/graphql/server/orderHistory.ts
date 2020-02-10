import gql from 'graphql-tag';

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPriceV2 {
              amount
            }
          }
        }
      }
    }
  }
`;
