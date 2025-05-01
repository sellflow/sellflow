export const updateCustomerName = async ({
  firstName,
  lastName,
  accessToken,
}: {
  firstName: string;
  lastName: string;
  accessToken: string;
}) =>
  await fetch(process.env.EXPO_PUBLIC_CUSTOMER_STORE_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({
      query: `
    mutation customerUpdate($input: CustomerUpdateInput!) {
      customerUpdate(input: $input) {
        customer {
          firstName
          lastName
        }
      }
    }
    `,
      variables: {
        input: {
          firstName,
          lastName,
        },
      },
    }),
  });

// Retrieves user account info given user accessToken
export const getUserInfo = async (accessToken: string) =>
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
        firstName
        lastName
        phoneNumber {
          marketingState
          phoneNumber
        }
        imageUrl
        emailAddress {
          marketingState
          emailAddress
        }
        defaultAddress {
          id
          address1
          address2
          city
          company
          country
          province
          zip
        }
      }
    }
    `,
    }),
  });
// Retrieves user info given user accessToken
export const getUser = async (accessToken: string) =>
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
        imageUrl
        displayName
        phoneNumber {
          phoneNumber
        }
      }
    }
    `,
    }),
  });
