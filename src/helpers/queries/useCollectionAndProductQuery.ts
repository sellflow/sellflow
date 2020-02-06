import { useQuery } from '@apollo/react-hooks';

import { GetCategoriesAndFeaturedProducts } from '../../generated/server/GetCategoriesAndFeaturedProducts';
import { GET_CATEGORIES_AND_FEATURED_PRODUCTS } from '../../graphql/server/categoriesAndFeaturedProducts';

export function useCollectionAndProductQuery() {
  let { loading, data } = useQuery<GetCategoriesAndFeaturedProducts>(
    GET_CATEGORIES_AND_FEATURED_PRODUCTS,
    { fetchPolicy: 'cache-and-network' },
  );

  return { data, loading };
}
