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
`;

export const SHOPPING_CART_REPLACE_ITEMS = gql`
  mutation ShoppingCartReplaceItem(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutID: ID!
  ) {
    checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutID) {
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
`;
