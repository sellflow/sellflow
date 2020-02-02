import gql from 'graphql-tag';

export const GET_COLLECTION = gql`
  query GetCollection($collectionHandle: String!) {
    collectionByHandle(handle: $collectionHandle) {
      id
      title
      handle
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            productType
            handle
            presentmentPriceRanges(first: 1, presentmentCurrencies: USD) {
              edges {
                node {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  originalSrc
                  transformedSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
