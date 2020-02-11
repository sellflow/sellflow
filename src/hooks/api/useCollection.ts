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
): Array<Product> {
  if (collectionData) {
    if (collectionData.collectionByHandle) {
      return collectionData.collectionByHandle.products.edges.map((item) => {
        let product = item.node;
        let firstImage = product.images.edges[0];
        let priceRangeMin = product.presentmentPriceRanges.edges[0];
        return {
          id: product.id,
          image: firstImage ? firstImage.node.transformedSrc.toString() : '',
          title: product.title,
          handle: product.handle,
          productType: product.productType,
          price: priceRangeMin
            ? Number(priceRangeMin.node.minVariantPrice.amount)
            : 0,
        };
      });
    }
  }
  return [];
}

function useCollectionQuery(collectionHandle: string) {
  let { data: collectionData, loading, refetch } = useQuery<
    GetCollection,
    GetCollectionVariables
  >(GET_COLLECTION, {
    variables: {
      collectionHandle,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
    },
  });
  let data = getProducts(collectionData);

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
