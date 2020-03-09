import { useState, useEffect, useRef } from 'react';
import { useQuery, QueryHookOptions } from '@apollo/react-hooks';

import { Product } from '../../types/types';
import { GET_COLLECTION } from '../../graphql/server/productCollection';
import {
  GetCollection,
  GetCollectionVariables,
} from '../../generated/server/GetCollection';
import {
  ProductCollectionSortKeys,
  CurrencyCode,
} from '../../generated/server/globalTypes';
import { GetCategoriesAndFeaturedProducts } from '../../generated/server/GetCategoriesAndFeaturedProducts';
import { GET_CATEGORIES_AND_FEATURED_PRODUCTS } from '../../graphql/server/categoriesAndFeaturedProducts';
import useDefaultCurrency from './useDefaultCurrency';
import { getDiscount } from '../../helpers/getDiscount';

function getProducts(
  collectionData: GetCollection | undefined,
  priceRange: [number, number],
): Array<Product> {
  let [minPrice, maxPrice] = priceRange;
  if (collectionData && collectionData.collectionByHandle) {
    let filteredData: Array<Product> = [];
    collectionData.collectionByHandle.products.edges.forEach((item) => {
      let product = item.node;
      let firstImage = product.images.edges[0];
      let priceRangeMin = product.presentmentPriceRanges.edges[0];
      if (
        Number(priceRangeMin.node.minVariantPrice.amount) < maxPrice &&
        Number(priceRangeMin.node.minVariantPrice.amount) > minPrice
      ) {
        let originalProductPrice = ~~product.variants.edges[0].node
          .presentmentPrices.edges[0].node.compareAtPrice?.amount;

        let productPrice = ~~product.variants.edges[0].node.presentmentPrices
          .edges[0].node.price.amount;

        let { price, discount } = getDiscount(
          originalProductPrice,
          productPrice,
        );

        filteredData.push({
          id: product.id,
          cursor: item.cursor,
          image: firstImage ? firstImage.node.transformedSrc.toString() : '',
          title: product.title,
          handle: product.handle,
          productType: product.productType,
          price: price,
          discount: discount,
          url: product.onlineStoreUrl,
        });
      }
    });
    return filteredData;
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
  ) => {
    isFetchingMore.current = type === 'scroll';
    let { data } = await refetchQuery(variables);
    let moreCollection = getProducts(data, priceRange);

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
