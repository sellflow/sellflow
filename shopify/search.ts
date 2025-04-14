import { client } from "./client";

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
