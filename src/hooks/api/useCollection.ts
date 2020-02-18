import { useQuery } from '@apollo/react-hooks';

import { Product } from '../../types/types';
import { GET_COLLECTION } from '../../graphql/server/productCollection';
import {
  GetCollection,
  GetCollectionVariables,
} from '../../generated/server/GetCollection';
import { ProductCollectionSortKeys } from '../../generated/server/globalTypes';
import { GetCategoriesAndFeaturedProducts } from '../../generated/server/GetCategoriesAndFeaturedProducts';
import { GET_CATEGORIES_AND_FEATURED_PRODUCTS } from '../../graphql/server/categoriesAndFeaturedProducts';

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
        filteredData.push({
          id: product.id,
          image: firstImage ? firstImage.node.transformedSrc.toString() : '',
          title: product.title,
          handle: product.handle,
          productType: product.productType,
          price: priceRangeMin
            ? Number(priceRangeMin.node.minVariantPrice.amount)
            : 0,
        });
      }
    });
    return filteredData;
  }
  return [];
}

function useCollectionQuery(
  collectionHandle: string,
  priceRange: [number, number],
) {
  let { data: collectionData, loading, refetch } = useQuery<
    GetCollection,
    GetCollectionVariables
  >(GET_COLLECTION, {
    variables: {
      collectionHandle,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
    },
  });
  let data = getProducts(collectionData, priceRange);

  return { data, loading, refetch };
}

function useCollectionAndProductQuery() {
  let { loading, data } = useQuery<GetCategoriesAndFeaturedProducts>(
    GET_CATEGORIES_AND_FEATURED_PRODUCTS,
    { fetchPolicy: 'cache-and-network' },
  );

  return { data, loading };
}

export { useCollectionQuery, useCollectionAndProductQuery };
