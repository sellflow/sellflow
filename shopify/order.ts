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
