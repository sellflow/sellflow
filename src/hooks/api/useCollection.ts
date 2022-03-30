import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';

import {
  GetCollection,
  GetCollection_collectionByHandle_products_edges as CollectionProducts,
  GetCollectionVariables,
} from '../../generated/server/GetCollection';
import {
  GetFeaturedProductsAndCategories,
  GetFeaturedProductsAndCategoriesVariables,
} from '../../generated/server/GetFeaturedProductsAndCategories';
import { ProductCollectionSortKeys } from '../../generated/server/globalTypes';
import { GET_FEATURED_PRODUCTS_AND_CATEGORIES } from '../../graphql/server/categoriesAndFeaturedProducts';
import { GET_COLLECTION } from '../../graphql/server/productCollection';
import mapToProducts from '../../helpers/mapToProducts';
import { CategoryItem, Product } from '../../types/types';

import useDefaultCountry from './useDefaultCountry';

function filterProducts(
  collectionProducts: CollectionProducts,
  priceRange: Array<number>,
) {
  let [minPrice, maxPrice] = priceRange;
  let { minVariantPrice } = collectionProducts.node.priceRange;
  if (
    Number(minVariantPrice.amount) <= maxPrice &&
    Number(minVariantPrice.amount) >= minPrice
  ) {
    return collectionProducts.node;
  }
}

function getProducts(
  collectionData: GetCollection | undefined,
  priceRange: Array<number>,
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
  priceRange: Array<number>,
) {
  let [isInitFetching, setInitFetching] = useState(true);
  let [isReloading, setIsReloading] = useState(true);
  let [collection, setCollection] = useState<Array<Product>>([]);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let {
    data: { countryCode },
  } = useDefaultCountry();

  let { data, error, loading, refetch: refetchQuery } = useQuery<
    GetCollection,
    GetCollectionVariables
  >(GET_COLLECTION, {
    variables: {
      collectionHandle,
      first,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
      country: countryCode,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  let getMoreUntilTarget = async (
    targetAmount: number,
    cursor: string | null,
    handle: string,
    filter: Array<number>,
  ) => {
    let result: Array<Product> = [];
    let moreData: Array<Product> = [];

    let { data } = await refetchQuery({
      first,
      collectionHandle: handle,
      after: cursor,
      country: countryCode,
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
    values?: Array<number>,
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
    error,
    loading: isReloading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
}

function useProductsAndCategoriesQuery(first: number) {
  let [categories, setCategories] = useState<Array<CategoryItem>>([]);
  let [products, setProducts] = useState<Array<Product>>([]);
  let [isInitFetching, setInitFetching] = useState(true);
  let isFetchingMore = useRef<boolean>(false);
  let hasMore = useRef<boolean>(true);

  let {
    data: { countryCode },
  } = useDefaultCountry();
  let { data, error, loading, refetch: refetchQuery } = useQuery<
    GetFeaturedProductsAndCategories,
    GetFeaturedProductsAndCategoriesVariables
  >(GET_FEATURED_PRODUCTS_AND_CATEGORIES, {
    variables: {
      first,
      country: countryCode,
    },
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
    error,
    loading,
    categories,
    refetch,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
  };
}

export { useCollectionQuery, useProductsAndCategoriesQuery };
