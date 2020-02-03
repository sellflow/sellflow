import gql from 'graphql-tag';

export const SHOPPING_CART_CREATE = gql`
  mutation ShoppingCartCreate($checkoutCreateInput: CheckoutCreateInput!) {
    checkoutCreate(input: $checkoutCreateInput) {
      checkoutUserErrors {
        message
      }
      checkout {
        lineItemsSubtotalPrice {
          amount
        }
        id
        subtotalPriceV2 {
          amount
          currencyCode
        }
        paymentDueV2 {
          amount
        }
        lineItems(first: 10) {
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
`;
