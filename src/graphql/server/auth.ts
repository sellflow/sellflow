import gql from 'graphql-tag';

export const CUSTOMER_REGISTER = gql`
  mutation CustomerRegister($email: String!, $password: String!) {
    customerCreate(input: { email: $email, password: $password }) {
      customer {
        email
        id
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
      email
      id
    }
  }
`;
