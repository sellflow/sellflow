import gql from 'graphql-tag';

export const CUSTOMER_ADD_NEW_ADDRESS = gql`
  mutation CustomerAddNewAddress(
    $customerAccessToken: String!
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      customerAddress {
        id
        name
        firstName
        lastName
        address1
        address2
        phone
        country
        city
        province
        zip
      }
      customerUserErrors {
        message
      }
    }
  }
`;

export const CUSTOMER_EDIT_ADDRESS = gql`
  mutation CustomerEditAddress(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        id
        name
        firstName
        lastName
        address1
        address2
        phone
        country
        city
        province
        zip
      }
      customerUserErrors {
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE = gql`
  mutation CustomerAddressDelete($id: ID!, $customerAccessToken: String!) {
    customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
      customerUserErrors {
        message
      }
      deletedCustomerAddressId
    }
  }
`;

export const CUSTOMER_SET_DEFAULT_ADDRESS = gql`
  mutation CustomerSetDefaultAddress(
    $customerAccessToken: String!
    $addressId: ID!
  ) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $addressId
    ) {
      customerUserErrors {
        message
      }
    }
  }
`;
