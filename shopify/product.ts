import { SelectedOptionInput } from "@/types/storefront.types";
import { client } from "./client";

//Returns a list of recommended items given a product id
export const getProductRecommendations = async (productId: string) =>
  await client.request(
    `
  #graphql
  query productRecommendations($productId: ID!) {
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
) =>
  await client.request(
    `#graphql
    query Product(
        $id: ID!
        $selectedOptions: [SelectedOptionInput!]!
      ) {
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
          selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
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
          embeddedUrl
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

export const getProducts = async () =>
  await client.request(
    `#graphql
    query getProducts($first: Int) {
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
        first: 10,
      },
    },
  );
