import gql from 'graphql-tag';

export const SET_AUTHENTICATED_USER = gql`
  mutation SetAuthenticatedUser($user: AuthenticatedUserInput!) {
    setAuthenticatedUser(user: $user) @client {
      id
      firstName
      lastName
      email
      expiresAt
    }
  }
`;

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authenticatedUser @client {
      id
      firstName
      lastName
      email
      expiresAt
    }
  }
`;

export const SET_RECENT_SEARCH = gql`
  mutation SetRecentSearch($search: String!) {
    setRecentSearch(search: $search) @client {
      title
    }
  }
`;

export const GET_RECENT_SEARCH = gql`
  query GetRecentSearch {
    recentSearch @client {
      title
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productHandle: String!) {
    removeFromWishlist(productHandle: $productHandle) @client {
      id
      handle
      images
      title
      price
      discount
      availableForSale
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($product: WishlistProductInput!) {
    addToWishlist(product: $product) @client {
      id
      handle
      images
      title
      price
      discount
      availableForSale
    }
  }
`;

export const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist @client {
      id
      handle
      images
      title
      price
      discount
      availableForSale
    }
  }
`;

export const GET_DEFAULT_CURRENCY = gql`
  query GetDefaultCurrency {
    defaultCurrency @client {
      currency
    }
  }
`;

export const SET_DEFAULT_CURRENCY = gql`
  mutation SetDefaultCurrency($currency: String!) {
    setDefaultCurrency(currency: $currency) @client {
      currency
    }
  }
`;
