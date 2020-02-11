import gql from 'graphql-tag';

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
