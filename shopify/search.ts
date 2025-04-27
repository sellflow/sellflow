import {
  ProductFilter,
  SearchSortKeys,
} from "@shopify/hydrogen-react/storefront-api-types";
import { client } from "./client";

export const getSearchResults = async (
  query: string,
  productFilters: ProductFilter[],
  accessToken: string | null | undefined,
  sortKey: SearchSortKeys,
  reverse: boolean,
) =>
  await client.request(
    `
  #graphql
  query searchProducts($query: String!, $productFilters: [ProductFilter!], $sortKey: SearchSortKeys, $reverse: Boolean) ${accessToken ? `@inContext(buyer: { customerAccessToken: "${accessToken}" })` : ""} {
    search(query: $query, first: 10, productFilters: $productFilters, sortKey: $sortKey, reverse: $reverse) {
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
        sortKey,
        reverse,
      },
    },
  );

export const getPredictiveSearchResults = async (
  search: string,
  accessToken: string | null | undefined,
) =>
  await client.request(
    `
  #graphql
  query suggestions($query: String!) ${accessToken ? `@inContext(buyer: { customerAccessToken: "${accessToken}" })` : ""} {
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
