import { useLazyQuery } from '@apollo/react-hooks';

import { Product } from '../../types/types';
import { SEARCH_RESULTS } from '../../graphql/server/searchProduct';
import { SearchResults } from '../../generated/server/SearchResults';

export default function getProducts(
  searchData: SearchResults | undefined,
): Array<Product> {
  if (searchData) {
    return searchData.products.edges.map((item) => {
      let product = item.node;
      return {
        id: product.id,
        image: product.images.edges[0].node.transformedSrc.toString(),
        title: product.title,
        productType: product.productType,
        price: Number(
          product.presentmentPriceRanges.edges[0].node.minVariantPrice.amount,
        ),
        handle: product.handle,
      };
    });
  }
  return [
    {
      id: '',
      title: '',
      productType: '',
      price: 0,
      image:
        'https://cdn.shopify.com/s/files/1/0281/8303/6043/files/WhatsApp_Image_2020-01-27_at_12.45.06.jpeg?v=1580104374',
      handle: '',
    },
  ];
}

export function useSearchProductsQuery() {
  let [searchProducts, { data: resultsData, loading, refetch }] = useLazyQuery<
    SearchResults
  >(SEARCH_RESULTS);
  let data = getProducts(resultsData);
  return { searchProducts, data, loading, refetch };
}
