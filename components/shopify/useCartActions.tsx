import { useCallback, useMemo } from "react";
import {
  AttributeInput,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CountryCode,
  LanguageCode,
  Cart as CartType,
  MutationCartDiscountCodesUpdateArgs,
  MutationCartNoteUpdateArgs,
} from "@shopify/hydrogen-react/storefront-api-types";
import {
  CartAttributesUpdate,
  CartBuyerIdentityUpdate,
  CartCreate,
  CartDiscountCodesUpdate,
  CartLineAdd,
  CartLineRemove,
  CartLineUpdate,
  CartNoteUpdate,
  CartQuery,
} from "@/shopify/cart";
import { PartialDeep } from "type-fest";
import {
  SHOPIFY_S,
  SHOPIFY_STOREFRONT_ID_HEADER,
  SHOPIFY_STOREFRONT_S_HEADER,
  SHOPIFY_STOREFRONT_Y_HEADER,
  SHOPIFY_Y,
  StorefrontApiResponseOkPartial,
  useShop,
} from "@shopify/hydrogen-react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CartResponse = PartialDeep<CartType, { recurseIntoArrays: true }>;

/**
 * The `useCartActions` hook returns helper graphql functions for Storefront Cart API
 *
 * See [cart API graphql mutations](https://shopify.dev/api/storefront/2025-01/objects/Cart)
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useCartActions({
  numCartLines,
  cartFragment,
  countryCode = "US",
  languageCode = "EN",
}: {
  /**  Maximum number of cart lines to fetch. Defaults to 250 cart lines. */
  numCartLines?: number;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/2025-01/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment: string;
  /** The ISO country code for i18n. Default to `US` */
  countryCode?: CountryCode;
  /** The ISO language code for i18n. Default to `EN` */
  languageCode?: LanguageCode;
}) {
  const fetchCart = useCartFetch();

  const cartFetch = useCallback(
    (cartId: string) => {
      return fetchCart<{ cart: CartResponse }>({
        query: CartQuery(),
        variables: {
          id: cartId,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [fetchCart, cartFragment, numCartLines, countryCode, languageCode],
  );

  const cartCreate = useCallback(
    (cart: CartInput) => {
      return fetchCart<{ cartCreate: { cart: CartResponse } }>({
        query: CartCreate(),
        variables: {
          input: cart,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const cartLineAdd = useCallback(
    (cartId: string, lines: CartLineInput[]) => {
      return fetchCart<{ cartLinesAdd: { cart: CartResponse } }>({
        query: CartLineAdd(),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const cartLineUpdate = useCallback(
    (cartId: string, lines: CartLineUpdateInput[]) => {
      return fetchCart<{ cartLinesUpdate: { cart: CartResponse } }>({
        query: CartLineUpdate(),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const cartLineRemove = useCallback(
    (cartId: string, lines: string[]) => {
      return fetchCart<{ cartLinesRemove: { cart: CartResponse } }>({
        query: CartLineRemove(),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const noteUpdate = useCallback(
    (cartId: string, note: MutationCartNoteUpdateArgs["note"]) => {
      return fetchCart<{ cartNoteUpdate: { cart: CartResponse } }>({
        query: CartNoteUpdate(),
        variables: {
          cartId,
          note,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [fetchCart, cartFragment, numCartLines, countryCode, languageCode],
  );

  const buyerIdentityUpdate = useCallback(
    (cartId: string, buyerIdentity: CartBuyerIdentityInput) => {
      return fetchCart<{ cartBuyerIdentityUpdate: { cart: CartResponse } }>({
        query: CartBuyerIdentityUpdate(),
        variables: {
          cartId,
          buyerIdentity,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const cartAttributesUpdate = useCallback(
    (cartId: string, attributes: AttributeInput[]) => {
      return fetchCart<{ cartAttributesUpdate: { cart: CartResponse } }>({
        query: CartAttributesUpdate(),
        variables: {
          cartId,
          attributes,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  const discountCodesUpdate = useCallback(
    (
      cartId: string,
      discountCodes: MutationCartDiscountCodesUpdateArgs["discountCodes"],
    ) => {
      return fetchCart<{ cartDiscountCodesUpdate: { cart: CartResponse } }>({
        query: CartDiscountCodesUpdate(cartFragment),
        variables: {
          cartId,
          discountCodes,
          numCartLines,
          country: countryCode,
          language: languageCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines, languageCode],
  );

  return useMemo(
    () => ({
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment,
    }),
    [
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment,
    ],
  );
}

export function useCartFetch() {
  const { storefrontId, getPublicTokenHeaders, getStorefrontApiUrl } =
    useShop();

  return useCallback(
    async <ReturnDataGeneric,>({
      query,
      variables,
    }: {
      query: string;
      variables: Record<string, unknown>;
    }): Promise<StorefrontApiResponseOkPartial<ReturnDataGeneric>> => {
      const headers = getPublicTokenHeaders({ contentType: "json" });

      if (storefrontId) {
        headers[SHOPIFY_STOREFRONT_ID_HEADER] = storefrontId;
      }

      // Find Shopify cookies
      headers[SHOPIFY_STOREFRONT_Y_HEADER] =
        (await AsyncStorage.getItem(SHOPIFY_Y)) || "";
      headers[SHOPIFY_STOREFRONT_S_HEADER] =
        (await AsyncStorage.getItem(SHOPIFY_S)) || "";

      return fetch(getStorefrontApiUrl(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: query.toString(),
          variables,
        }),
      })
        .then(
          (res) =>
            res.json() as StorefrontApiResponseOkPartial<ReturnDataGeneric>,
        )
        .catch((error) => {
          return {
            data: undefined,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            errors: error?.toString(),
          };
        });
    },
    [getPublicTokenHeaders, storefrontId, getStorefrontApiUrl],
  );
}
