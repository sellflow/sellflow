import gql from 'graphql-tag';

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($productHandle: String!) {
    productByHandle(handle: $productHandle) {
      id
      title
      description
      options(first: 5) {
        name
        values
      }
    }
  }
`;

export const GET_PRODUCT_VARIANT_ID = gql`
  query GetProductVariantID(
    $selectedOptions: [SelectedOptionInput!]!
    $handle: String!
  ) {
    productByHandle(handle: $handle) {
      id
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
      }
    }
  }
`;
