import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSearchResults } from "@/shopify/search";
import { useCallback, useEffect, useReducer, useState } from "react";
import { ClientResponse } from "@shopify/storefront-api-client";
import { ProductQuery } from "@/types/storefront.generated";
import { Colors } from "@/constants/Colors";
import Product from "@/components/ProductCard";
import {
  Filter,
  ProductFilter as ProductFilterType,
} from "@shopify/hydrogen-react/storefront-api-types";
import ProductFilter from "@/components/ProductFilter";
import FilterDropdown from "@/components/FilterDropdown";
import DropdownProvider from "@/components/DropdownProvider";
import { Trans } from "@lingui/react/macro";

export type Action =
  | { type: "include"; input: Object }
  | { type: "remove"; input: Object }
  | { type: "price"; input: { min: number; max: number | null } }
  | { type: "clearAll" };

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

export default function Search() {
  const colorScheme = useColorScheme();
  const { query } = useLocalSearchParams();
  const [products, setProducts] = useState<
    ClientResponse<ProductQuery> | undefined
  >();
  const [state, dispatch] = useReducer(reducer, []);

  const searchProducts = useCallback(async () => {
    const res = await getSearchResults(query as string, state);
    setProducts(res);
  }, [query, state]);

  useEffect(() => {
    try {
      searchProducts();
    } catch (e) {
      console.error(e);
    }
  }, [searchProducts]);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[styles.Container, { backgroundColor: backgroundColor }]}
      >
        <DropdownProvider>
          <View style={styles.ContentContainer}>
            {products ? (
              <>
                <Text style={[styles.Heading, { color: textColor }]}>
                  <Trans>Showing search results for {query}</Trans>
                </Text>
                {products?.data?.search?.productFilters && (
                  <View style={styles.FilterContainer}>
                    {products?.data?.search?.productFilters.map(
                      (filter: Filter, index: number) => (
                        <ProductFilter
                          filter={filter}
                          key={index}
                          colorScheme={colorScheme}
                        />
                      ),
                    )}
                  </View>
                )}
                <View style={styles.ProductContainer}>
                  {products?.data?.search?.edges?.map(
                    ({ node }: { node: any }, index: number) => (
                      <Product node={node} key={index} />
                    ),
                  )}
                </View>
              </>
            ) : (
              <ActivityIndicator color={textColor} />
            )}
            <FilterDropdown
              colorScheme={colorScheme}
              state={state}
              dispatch={dispatch}
            />
          </View>
        </DropdownProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
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
});
