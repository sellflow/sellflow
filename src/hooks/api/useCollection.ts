import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Product, CategoryItem } from '../../types/types';
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
import { GET_FEATURED_PRODUCTS_AND_CATEGORIES } from '../../graphql/server/categoriesAndFeaturedProducts';
import mapToProducts from '../../helpers/mapToProducts';
import {
  GetFeaturedProductsAndCategories,
  GetFeaturedProductsAndCategoriesVariables,
} from '../../generated/server/GetFeaturedProductsAndCategories';

import useDefaultCurrency from './useDefaultCurrency';
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
  let [isReloading, setIsReloading] = useState<boolean>(true);
  let [collection, setCollection] = useState<Array<Product>>([]);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let defaultCurrency = useDefaultCurrency().data;

  let { data, loading, refetch: refetchQuery } = useQuery<
    GetCollection,
    GetCollectionVariables
  >(GET_COLLECTION, {
    variables: {
      collectionHandle,
      first,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
      presentmentCurrencies: [defaultCurrency],
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  let getMoreUntilTarget = async (
    targetAmount: number,
    cursor: string | null,
    handle: string,
    filter: [number, number],
  ) => {
    let result: Array<Product> = [];
    let moreData: Array<Product> = [];

    let { data } = await refetchQuery({
      first,
      collectionHandle: handle,
      after: cursor,
    });

    let productsData = getProducts(data, filter);
    hasMore.current = !!data.collectionByHandle?.products.pageInfo.hasNextPage;
    let nextCursor = cursor;
    if (productsData[productsData.length - 1]) {
      nextCursor = productsData[productsData.length - 1].cursor || cursor;
    }
    if (hasMore.current === false && productsData.length <= 0) {
      return result;
    }
    if (productsData.length < targetAmount) {
      moreData = await getMoreUntilTarget(
        targetAmount - productsData.length,
        nextCursor,
        handle,
        filter,
      );
      productsData.push(...moreData);
      result = productsData;
    } else {
      result = productsData.slice(0, targetAmount);
    }
    return result;
  };

  let refetch = async (
    type: 'sort' | 'scroll',
    variables: GetCollectionVariables | undefined,
    values?: [number, number],
  ) => {
    isFetchingMore.current = type === 'scroll';
    if (!isFetchingMore.current) {
      setIsReloading(true);
    }
    let { data } = await refetchQuery(variables);
    let moreCollection = getProducts(data, values || priceRange);

    hasMore.current = !!data.collectionByHandle?.products.pageInfo.hasNextPage;
    let cursor = null;
    if (moreCollection[moreCollection.length - 1]) {
      cursor = moreCollection[moreCollection.length - 1].cursor || null;
    }

    if (moreCollection.length < first && hasMore.current) {
      let newCollection = await getMoreUntilTarget(
        first - moreCollection.length,
        cursor,
        data.collectionByHandle ? data.collectionByHandle.handle : '',
        values || priceRange,
      );
      moreCollection.push(...newCollection);
    }

    if (type === 'sort') {
      setCollection(moreCollection);
      setIsReloading(false);
    } else {
      setCollection([...collection, ...moreCollection]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data && !!data.collectionByHandle) {
      let newCollection = mapToProducts(data.collectionByHandle.products);
      hasMore.current = !!data.collectionByHandle?.products.pageInfo
        .hasNextPage;
      setCollection(newCollection);
      setIsReloading(false);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    collection,
    loading: isReloading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
}

function useProductsAndCategoriesQuery(currency: CurrencyCode, first: number) {
  let [categories, setCategories] = useState<Array<CategoryItem>>([]);
  let [products, setProducts] = useState<Array<Product>>([]);
  let [isInitFetching, setInitFetching] = useState<boolean>(true);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let { loading, data, refetch: refetchQuery } = useQuery<
    GetFeaturedProductsAndCategories,
    GetFeaturedProductsAndCategoriesVariables
  >(GET_FEATURED_PRODUCTS_AND_CATEGORIES, {
    variables: { first },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  let refetch = async (
    type: 'update' | 'scroll',
    variables?: GetFeaturedProductsAndCategoriesVariables,
  ) => {
    isFetchingMore.current = type === 'scroll';
    let { data } = await refetchQuery(variables);
    let moreProducts = mapToProducts(data.products);
    hasMore.current = !!data.products.pageInfo.hasNextPage;

    if (type === 'update') {
      setProducts(moreProducts);
    } else {
      setProducts([...products, ...moreProducts]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let products = mapToProducts(data.products);
      hasMore.current = !!data.products.pageInfo.hasNextPage;

      let categories: Array<CategoryItem> = data.collections.edges.map(
        (item) => ({
          id: item.node.id,
          title: item.node.title,
          handle: item.node.handle,
          cursor: item.cursor,
          image: item.node.image?.transformedSrc || undefined,
        }),
      );
      setCategories(categories);

      setProducts(products);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    loading,
    categories,
    refetch,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
  };
}

export { useCollectionQuery, useProductsAndCategoriesQuery };
