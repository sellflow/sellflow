import { ScrollView, Text, View, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSearchResults } from "@/shopify/search";
import { useReducer } from "react";
import Product from "@/components/ProductCard";
import {
  Filter,
  ProductFilter as ProductFilterType,
  SearchSortKeys,
} from "@shopify/hydrogen-react/storefront-api-types";
import ProductFilter from "@/components/ProductFilter";
import FilterDropdown from "@/components/FilterDropdown";
import DropdownProvider from "@/components/DropdownProvider";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet } from "react-native-unistyles";

export type Action =
  | { type: "include"; input: Object }
  | { type: "remove"; input: Object }
  | { type: "price"; input: { min: number; max: number | null } }
  | { type: "clearAll" };

export type SortAction =
  | { type: "priceLowToHigh" }
  | { type: "priceHighToLow" }
  | { type: "mostRelevant" }
  | { type: "leastRelevant" };

export interface SortReducerState {
  sortKey: SearchSortKeys;
  reverse: boolean;
}

function reducer(
  state: ProductFilterType[],
  action: Action,
): ProductFilterType[] {
  // Specific indexes are set so that the filter dropdown menu can follow the correct state for the checkbox;
  const newState = [...state];
  switch (action.type) {
    case "include": {
      newState.push(action.input);
      return newState;
    }
    case "remove": {
      const index = newState.indexOf(action.input);
      newState.splice(index, 1);
      return newState;
    }
    case "price": {
      const index = state.findIndex((el) => el?.price);
      if (index > -1) {
        newState.splice(index, 1);
        newState.push({
          price: { min: action.input.min, max: action.input.max },
        });

        return newState;
      }
      newState.push({
        price: { min: action.input.min, max: action.input.max },
      });

      return newState;
    }
    case "clearAll": {
      return [];
    }
  }
}

function sortReducer(
  state: SortReducerState,
  action: SortAction,
): SortReducerState {
  switch (action.type) {
    case "priceLowToHigh": {
      return {
        sortKey: "PRICE",
        reverse: false,
      };
    }
    case "priceHighToLow": {
      return {
        sortKey: "PRICE",
        reverse: true,
      };
    }
    case "leastRelevant": {
      return {
        sortKey: "RELEVANCE",
        reverse: false,
      };
    }
    case "mostRelevant": {
      return {
        sortKey: "RELEVANCE",
        reverse: true,
      };
    }
  }
}

export default function Search() {
  const { query } = useLocalSearchParams();
  const [state, dispatch] = useReducer(reducer, []);
  const [sortState, sortDispatch] = useReducer(sortReducer, {
    sortKey: "RELEVANCE",
    reverse: false,
  });
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["search", accessToken, state, query, sortState],
    queryFn: async () => {
      const data = await getSearchResults(
        query as string,
        state,
        accessToken,
        sortState.sortKey,
        sortState.reverse,
      );
      if (data.errors) {
        //@ts-ignore
        throw new Error("Failed to fetch search results: ", data.errors);
      }

      return data.data.search;
    },
  });

  if (isError) {
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.Container}>
        <View style={styles.ContentContainer}>
          <Text style={styles.Heading}>
            <Trans>An unexpected error has occurred {error.message}</Trans>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.Container}>
        <DropdownProvider>
          <View style={styles.ContentContainer}>
            <Text style={styles.Heading}>
              <Trans>Showing search results for {query}</Trans>
            </Text>
            {isPending ? (
              <View style={styles.ProductContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </View>
            ) : (
              <>
                {data.productFilters && (
                  <View style={styles.FilterContainer}>
                    {data.productFilters.map(
                      (filter: Filter, index: number) => (
                        <ProductFilter filter={filter} key={index} />
                      ),
                    )}
                    <ProductFilter filter="sort" />
                  </View>
                )}
                <View style={styles.ProductContainer}>
                  {data.edges?.map(({ node }: { node: any }, index: number) => (
                    <Product node={node} key={index} />
                  ))}
                </View>
              </>
            )}
            <FilterDropdown
              state={state}
              dispatch={dispatch}
              sortState={sortState}
              sortDispatch={sortDispatch}
            />
          </View>
        </DropdownProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  Container: {
    width: "100%",
    backgroundColor: theme.colors.background,
  },
  ContentContainer: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    position: "relative",
  },
  Heading: {
    fontSize: 20,
    fontWeight: 600,
    paddingLeft: 8,
    color: theme.colors.text,
  },
  FilterContainer: {
    flexDirection: "row",
    padding: 8,
    zIndex: 5,
    gap: 8,
  },
  ProductContainer: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));
