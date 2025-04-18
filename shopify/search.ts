import { ProductFilter } from "@shopify/hydrogen-react/storefront-api-types";
import { client } from "./client";

export const getSearchResults = async (
  query: string,
  productFilters: ProductFilter[],
) =>
  await client.request(
    `
  #graphql
  query searchProducts($query: String!, $productFilters: [ProductFilter!]) {
    search(query: $query, first: 10, productFilters: $productFilters) {
      edges {
        node {
          ... on Product {
            id
            title
            featuredImage {
              altText
              url
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variantsCount {
              count
            }
          }
        }
      }
      productFilters {
        id
        label
        presentation
        type
        values {
          id
          count
          image {
            alt
            image {
              url
            }
          }
          input
          label
          swatch {
            color
            image {
              alt
              image {
                url
              }
            }
          }
        }
      }
      totalCount
    }
  }
  `,
    {
      variables: {
        query,
        productFilters,
      },
    },
  );

export const getPredictiveSearchResults = async (search: string) =>
  await client.request(
    `
  #graphql
  query suggestions($query: String!) {
    predictiveSearch(query: $query) {
      products {
        id
        featuredImage {
          altText
          url
        }
        title
      }
    }
  }
  `,
    { variables: { query: search } },
  );
