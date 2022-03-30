import gql from 'graphql-tag';

export const GET_FEATURED_PRODUCTS_AND_CATEGORIES = gql`
  query GetFeaturedProductsAndCategories(
    $first: Int!
    $after: String
    $country: CountryCode!
  ) @inContext(country: $country) {
    collections(first: 250) {
      edges {
        cursor
        node {
          image {
            transformedSrc
          }
          handle
          id
          title
        }
      }
      pageInfo {
        hasNextPage
      }
    }
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          handle
          availableForSale
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
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
    }
  }
`;
