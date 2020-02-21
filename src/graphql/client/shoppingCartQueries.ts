import gql from 'graphql-tag';

export const GET_SHOPPING_CART = gql`
  query GetShoppingCart {
    shoppingCart @client {
      id
      items {
        quantity
        variantId
      }
    }
  }
`;

export const ADD_TO_SHOPPING_CART = gql`
  mutation AddToShoppingCart($variantId: String!, $quantity: Int!) {
    addToShoppingCart(quantity: $quantity, variantId: $variantId) @client {
      id
      items {
        quantity
        variantId
      }
    }
  }
`;

export const SET_SHOPPING_CART_ID = gql`
  mutation SetShoppingCartID($id: String!) {
    setShoppingCartID(id: $id) @client {
      id
    }
  }
`;

export const SET_SHOPPING_CART = gql`
  mutation SetShoppingCart($items: [LineItemInput!]!, $id: String!) {
    setShoppingCart(items: $items, id: $id) @client {
      id
      items {
        quantity
        variantId
      }
    }
  }
`;

export const RESET_SHOPPING_CART = gql`
  mutation ResetShoppingCart {
    resetShoppingCart @client {
      id
    }
  }
`;
