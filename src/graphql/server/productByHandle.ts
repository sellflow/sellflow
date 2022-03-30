import gql from 'graphql-tag';

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($productHandle: String!, $country: CountryCode!)
    @inContext(country: $country) {
    productByHandle(handle: $productHandle) {
      id
      title
      handle
      availableForSale
      description
      onlineStoreUrl
      options(first: 5) {
        name
        values
      }
      images(first: 5) {
        edges {
          node {
            id
            originalSrc
            transformedSrc
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            quantityAvailable
            compareAtPriceV2 {
              amount
              currencyCode
            }
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_VARIANT = gql`
  query GetProductVariant(
    $selectedOptions: [SelectedOptionInput!]!
    $handle: String!
    $country: CountryCode!
  ) @inContext(country: $country) {
    productByHandle(handle: $handle) {
      id
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        quantityAvailable
        compareAtPriceV2 {
          amount
          currencyCode
        }
        priceV2 {
          amount
          currencyCode
        }
      }
    }
  }
`;
