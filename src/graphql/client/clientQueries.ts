import gql from 'graphql-tag';

export const SET_CUSTOMER = gql`
  mutation SetCustomer($customer: CustomerInput!) {
    setCustomer(customer: $customer) @client {
      id
      firstName
      lastName
      email
      expiresAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer @client {
      id
      firstName
      lastName
      email
      expiresAt
    }
  }
`;
