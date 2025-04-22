import { SelectedOptionInput } from "@/types/storefront.types";
import { client } from "./client";
import {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen-react/storefront-api-types";

//Returns a list of recommended items given a product id
export const getProductRecommendations = async (
  productId: string,
  countryCode: CountryCode,
  languageCode: LanguageCode,
) =>
  await client.request(
    `
  #graphql
  query productRecommendations($productId: ID!) @inContext(country: ${countryCode}, language: ${languageCode}) {
    productRecommendations(productId: $productId) {
      id
      featuredImage {
        altText
        url
      }
      title
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      selectedOrFirstAvailableVariant {
        id
      }
      variantsCount {
        count
      }
    }
  }
  `,
    {
      variables: {
        productId,
      },
    },
  );

export const getProduct = async (
  id: string,
  selectedOptions: SelectedOptionInput[],
  countryCode: CountryCode,
  languageCode: LanguageCode,
) =>
  await client.request(
    `#graphql
    query Product (
        $id: ID!
        $selectedOptions: [SelectedOptionInput!]!
      ) @inContext(country: ${countryCode}, language: ${languageCode}) {
        product(id: $id) {
          id
          title
          description
          options {
            name
            optionValues {
              name
            }
          }
          selectedVariant: selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions) {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                quantityAvailable
                price {
                  amount
                  currencyCode
                  }
                selectedOptions {
                  name
                  value
                }
                availableForSale
              }
            }
          }
          media(first: 10) {
            edges {
              node {
                mediaContentType
                alt
                ...mediaFieldsByType
              }
            }
          }
          seo {
            description
            title
          }
        }
      }
      fragment mediaFieldsByType on Media {
        ... on ExternalVideo {
          id
          originUrl
        }
        ... on MediaImage {
          image {
            url
          }
        }
        ... on Model3d {
          sources {
            url
            mimeType
            format
            filesize
          }
        }
        ... on Video {
          sources {
            url
            mimeType
            format
            height
            width
          }
        }
      }
    `,
    {
      variables: {
        id,
        selectedOptions,
      },
    },
  );

export const getProducts = async (
  countryCode: CountryCode,
  languageCode: LanguageCode,
) =>
  await client.request(
    `#graphql
    query getProducts($first: Int) @inContext(country: ${countryCode}, language: ${languageCode}) {
    products(first: $first) {
      edges {
        node {
          id
          title
          variantsCount {
            count
          }
          selectedOrFirstAvailableVariant {
            id
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            altText
            height
            width
            url
          }
        }
      }
    }
  }`,
    {
      variables: {
        first: 12,
      },
    },
  );
