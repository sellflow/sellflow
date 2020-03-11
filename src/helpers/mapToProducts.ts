import {
  GetCollection_collectionByHandle_products as CollectionProducts,
  GetCollection_collectionByHandle_products_edges as FilteredProducts,
} from '../generated/server/GetCollection';
import { GetCategoriesAndFeaturedProducts_products as FeaturedProducts } from '../generated/server/GetCategoriesAndFeaturedProducts';
import { SearchResults_products as SearchResultProducts } from '../generated/server/SearchResults';
import { Product } from '../types/types';
import { getDiscount } from './getDiscount';

type CompatibleType =
  | CollectionProducts
  | FeaturedProducts
  | SearchResultProducts
  | { edges: Array<FilteredProducts> };

export default function mapToProducts(
  products: CompatibleType,
): Array<Product> {
  return products.edges.map((item) => {
    let product = item.node;
    let firstImage = product.images.edges[0];

    let originalProductPrice = ~~product.variants.edges[0].node
      .presentmentPrices.edges[0].node.compareAtPrice?.amount;

    let productPrice = ~~product.variants.edges[0].node.presentmentPrices
      .edges[0].node.price.amount;

    let { price, discount } = getDiscount(originalProductPrice, productPrice);

    return {
      id: product.id,
      cursor: item.cursor,
      images: [firstImage ? firstImage.node.transformedSrc : ''],
      title: product.title,
      productType: product.productType,
      price: price,
      discount: discount,
      handle: product.handle,
      availableForSale: product.availableForSale,
    };
  });
}
