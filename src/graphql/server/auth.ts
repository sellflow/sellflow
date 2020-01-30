import gql from 'graphql-tag';

export const CUSTOMER_REGISTER = gql`
  mutation CustomerRegister(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    customerCreate(
      input: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      customer {
        id
        firstName
        lastName
        email
      }
    }
    customerAccessTokenCreate(input: { email: $email, password: $password }) {
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

export const CUSTOMER_CREATE_TOKEN = gql`
  mutation CustomerCreateToken($email: String!, $password: String!) {
    customerAccessTokenCreate(input: { email: $email, password: $password }) {
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

export const GET_CUSTOMER_DATA = gql`
  query GetCustomerData($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      id
      firstName
      lastName
      email
    }
  }
`;
