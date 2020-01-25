import gql from 'graphql-tag';

export const SET_LOCAL_STATE = gql`
  mutation SetLocalState($customer: CustomerInput!) {
    setLocalState(customer: $customer) @client {
      id
      email
      expiresAt
    }
  }
`;

export const GET_LOCAL_STATE = gql`
  query GetLocalState {
    customer @client {
      id
      email
      expiresAt
    }
  }
`;
