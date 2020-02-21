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
              id
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

export const SHOPPING_CART_UPDATE_ADDRESS = gql`
  mutation ShoppingCartUpdateAddress(
    $checkoutId: ID!
    $shippingAddress: MailingAddressInput!
  ) {
    checkoutShippingAddressUpdateV2(
      checkoutId: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkoutUserErrors {
        message
      }
      checkout {
        webUrl
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
        totalPriceV2 {
          amount
        }
        shippingLine {
          priceV2 {
            amount
          }
        }
        requiresShipping
        availableShippingRates {
          ready
          shippingRates {
            handle
            priceV2 {
              amount
            }
            title
          }
        }
        taxesIncluded
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

export const SHOPPING_CART_CUSTOMER_ASSOCIATE = gql`
  mutation ShoppingCartCustomerAssociate(
    $checkoutId: ID!
    $customerAccessToken: String!
  ) {
    checkoutCustomerAssociateV2(
      checkoutId: $checkoutId
      customerAccessToken: $customerAccessToken
    ) {
      checkout {
        id
        lineItems(first: 19) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
      customer {
        id
        firstName
        lastName
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;
