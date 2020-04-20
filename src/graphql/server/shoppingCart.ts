import gql from 'graphql-tag';

export const SHOPPING_CART_CREATE = gql`
  mutation ShoppingCartCreate(
    $checkoutCreateInput: CheckoutCreateInput!
    $currencyCode: [CurrencyCode!]
  ) {
    checkoutCreate(input: $checkoutCreateInput) {
      checkoutUserErrors {
        message
      }
      checkout {
        lineItemsSubtotalPrice {
          amount
        }
        id
        currencyCode
        subtotalPriceV2 {
          amount
          currencyCode
        }
        paymentDueV2 {
          amount
        }
        lineItems(first: 250) {
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
`;

export const SHOPPING_CART_REPLACE_ITEMS = gql`
  mutation ShoppingCartReplaceItem(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutID: ID!
    $currencyCode: [CurrencyCode!]
  ) {
    checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutID) {
      checkout {
        lineItemsSubtotalPrice {
          amount
        }
        id
        currencyCode
        subtotalPriceV2 {
          amount
          currencyCode
        }
        paymentDueV2 {
          amount
        }
        lineItems(first: 250) {
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
        lineItems(first: 250) {
          edges {
            node {
              title
              quantity
              variant {
                id
                quantityAvailable
              }
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

export const SHOPPING_CART_DISCOUNT_CODE_APPLY = gql`
  mutation ShoppingCartDiscountCodeApply(
    $checkoutId: ID!
    $discountCode: String!
    $currencyCode: [CurrencyCode!]
  ) {
    checkoutDiscountCodeApplyV2(
      checkoutId: $checkoutId
      discountCode: $discountCode
    ) {
      checkoutUserErrors {
        code
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
        taxesIncluded
        lineItems(first: 250) {
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
                quantityAvailable
                id
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
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const SHOPPING_CART_DISCOUNT_CODE_REMOVE = gql`
  mutation ShoppingCartDiscountCodeRemove($checkoutId: ID!) {
    checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;
