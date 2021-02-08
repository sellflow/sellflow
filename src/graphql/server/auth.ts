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
      customerUserErrors {
        message
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

export const CUSTOMER_RENEW_TOKEN = gql`
  mutation CustomerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
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
      lastIncompleteCheckout {
        id
        lineItems(first: 250) {
          edges {
            node {
              variant {
                id
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses(
    $customerAccessToken: String!
    $first: Int!
    $after: String
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      addresses(first: $first, after: $after) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            name
            firstName
            lastName
            phone
            city
            province
            address1
            address2
            zip
            country
          }
        }
      }
      defaultAddress {
        id
        name
        firstName
        lastName
        phone
        city
        province
        address1
        zip
        country
      }
    }
  }
`;

export const UPDATE_CUSTOMER_DATA = gql`
  mutation UpdateCustomerData(
    $customerAccessToken: String!
    $password: String
    $lastName: String!
    $firstName: String!
    $email: String!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      customer {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const INITIATE_PASSWORD_RESET = gql`
  mutation InitiatePasswordReset($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        message
      }
    }
  }
`;

export const REMOVE_ACCESS_TOKEN = gql`
  mutation RemoveAccessToken($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
    }
  }
`;
