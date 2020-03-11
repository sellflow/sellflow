import { useState, useEffect, useRef } from 'react';
import { useQuery, QueryHookOptions } from '@apollo/react-hooks';

import { Product } from '../../types/types';
import { GET_COLLECTION } from '../../graphql/server/productCollection';
import {
  GetCollection,
  GetCollectionVariables,
  GetCollection_collectionByHandle_products_edges as CollectionProducts,
} from '../../generated/server/GetCollection';
import {
  ProductCollectionSortKeys,
  CurrencyCode,
} from '../../generated/server/globalTypes';
import { GetCategoriesAndFeaturedProducts } from '../../generated/server/GetCategoriesAndFeaturedProducts';
import { GET_CATEGORIES_AND_FEATURED_PRODUCTS } from '../../graphql/server/categoriesAndFeaturedProducts';
import useDefaultCurrency from './useDefaultCurrency';
import mapToProducts from '../../helpers/mapToProducts';

function filterProducts(
  collectionProducts: CollectionProducts,
  priceRange: [number, number],
) {
  let [minPrice, maxPrice] = priceRange;
  let productPriceRange =
    collectionProducts.node.presentmentPriceRanges.edges[0];

  if (
    Number(productPriceRange.node.minVariantPrice.amount) <= maxPrice &&
    Number(productPriceRange.node.minVariantPrice.amount) >= minPrice
  ) {
    return collectionProducts.node;
  }
}

function getProducts(
  collectionData: GetCollection | undefined,
  priceRange: [number, number],
): Array<Product> {
  if (collectionData && collectionData.collectionByHandle) {
    let filtered = {
      edges: collectionData.collectionByHandle.products.edges.filter(
        (product) => filterProducts(product, priceRange),
      ),
    };

    return mapToProducts(filtered);
  }
  return [];
}

function useCollectionQuery(
  collectionHandle: string,
  first: number,
  priceRange: [number, number],
) {
  let [isInitFetching, setInitFetching] = useState<boolean>(true);
  let [collection, setCollection] = useState<Array<Product>>([]);
  let isFetchingMore = useRef(false);
  let hasMore = useRef(true);

  let defaultCurrency = useDefaultCurrency().data;
  let currency: keyof typeof CurrencyCode = defaultCurrency;

  let { data, loading, refetch: refetchQuery } = useQuery<
    GetCollection,
    GetCollectionVariables
  >(GET_COLLECTION, {
    variables: {
      collectionHandle,
      first,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
      presentmentCurrencies: [CurrencyCode[currency]],
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  let refetch = async (
    type: 'sort' | 'scroll',
    variables: GetCollectionVariables | undefined,
    values?: [number, number],
  ) => {
    isFetchingMore.current = type === 'scroll';
    let { data } = await refetchQuery(variables);
    let moreCollection = getProducts(data, values || priceRange);
    if (type === 'sort') {
      setCollection(moreCollection);
    } else {
      if (moreCollection.length <= 0) {
        hasMore.current = false;
      } else {
        hasMore.current = true;
      }
      setCollection([...collection, ...moreCollection]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let newCollection = getProducts(data, priceRange);
      if (newCollection.length < first) {
        hasMore.current = false;
      }
      setCollection(newCollection);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    collection,
    loading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
}

function useCollectionAndProductQuery(
  options?: QueryHookOptions<GetCategoriesAndFeaturedProducts>,
) {
  let { loading, data } = useQuery<GetCategoriesAndFeaturedProducts>(
    GET_CATEGORIES_AND_FEATURED_PRODUCTS,
    { fetchPolicy: 'cache-and-network', ...options },
  );

  return { data, loading };
}

export { useCollectionQuery, useCollectionAndProductQuery };
