import gql from 'graphql-tag';

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($productHandle: String!) {
    productByHandle(handle: $productHandle) {
      title
      description
      options(first: 5) {
        name
        values
      }
    }
  }
`;
