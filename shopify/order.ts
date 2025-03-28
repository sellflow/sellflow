export const getOrder = async (accessToken: string, orderId: string) =>
  await fetch(process.env.EXPO_PUBLIC_CUSTOMER_STORE_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({
      query: `
      {
        order(id: "${orderId}") {
          number
          createdAt
          totalPrice {
            amount
            currencyCode
          }
          fulfillments (first: 1) {
            edges {
              node {
                estimatedDeliveryAt
                latestShipmentStatus
              }
            }
          }
          lineItems(first: 25) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                name
                quantity
                variantOptions {
                  name
                  value
                }
                productId
              }
            }
            pageInfo {
              endCursor
            }
          }
          requiresShipping
          shippingAddress {
            address1
            city
            country
            firstName
            lastName
            company
            formattedArea
            country
          }
          subtotal {
            amount
            currencyCode
          }
          totalShipping {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          totalTip {
            amount
            currencyCode
          }
        }
      }
    `,
    }),
  });

export const getOrders = async (accessToken: string) =>
  await fetch(process.env.EXPO_PUBLIC_CUSTOMER_STORE_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({
      query: `
      {
        customer {
          orders (first: 10) {
            edges {
              node {
                id
                fulfillments (first: 10) {
                  edges {
                    node {
                      estimatedDeliveryAt
                      isPickedUp
                      latestShipmentStatus
                      requiresShipping
                      fulfillmentLineItems (first: 1) {
                        edges {
                          node {
                            lineItem {
                              name
                              image {
                                url
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
      }
    `,
    }),
  });
