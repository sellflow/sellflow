/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types';

export type ProductRecommendationsQueryVariables = StorefrontTypes.Exact<{
  productId: StorefrontTypes.Scalars['ID']['input'];
}>;


export type ProductRecommendationsQuery = { productRecommendations?: StorefrontTypes.Maybe<Array<(
    Pick<StorefrontTypes.Product, 'id' | 'title'>
    & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'altText' | 'url'>>, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount'> }, selectedOrFirstAvailableVariant?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ProductVariant, 'id'>>, variantsCount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Count, 'count'>> }
  )>> };

export type ProductQueryVariables = StorefrontTypes.Exact<{
  id: StorefrontTypes.Scalars['ID']['input'];
  selectedOptions: Array<StorefrontTypes.SelectedOptionInput> | StorefrontTypes.SelectedOptionInput;
}>;


export type ProductQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'title' | 'description'>
    & { options: Array<(
      Pick<StorefrontTypes.ProductOption, 'name'>
      & { optionValues: Array<Pick<StorefrontTypes.ProductOptionValue, 'name'>> }
    )>, selectedVariant?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.ProductVariant, 'id' | 'availableForSale'>
      & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
    )>, variants: { edges: Array<{ node: (
          Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'quantityAvailable' | 'availableForSale'>
          & { price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
        ) }> }, media: { edges: Array<{ node: Pick<StorefrontTypes.ExternalVideo, 'mediaContentType' | 'alt' | 'id' | 'embeddedUrl'> | (
          Pick<StorefrontTypes.MediaImage, 'mediaContentType' | 'alt'>
          & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> }
        ) | (
          Pick<StorefrontTypes.Model3d, 'mediaContentType' | 'alt'>
          & { sources: Array<Pick<StorefrontTypes.Model3dSource, 'url' | 'mimeType' | 'format' | 'filesize'>> }
        ) | (
          Pick<StorefrontTypes.Video, 'mediaContentType' | 'alt'>
          & { sources: Array<Pick<StorefrontTypes.VideoSource, 'url' | 'mimeType' | 'format' | 'height' | 'width'>> }
        ) }> }, seo: Pick<StorefrontTypes.Seo, 'description' | 'title'> }
  )> };

type MediaFieldsByType_ExternalVideo_Fragment = Pick<StorefrontTypes.ExternalVideo, 'id' | 'embeddedUrl'>;

type MediaFieldsByType_MediaImage_Fragment = { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> };

type MediaFieldsByType_Model3d_Fragment = { sources: Array<Pick<StorefrontTypes.Model3dSource, 'url' | 'mimeType' | 'format' | 'filesize'>> };

type MediaFieldsByType_Video_Fragment = { sources: Array<Pick<StorefrontTypes.VideoSource, 'url' | 'mimeType' | 'format' | 'height' | 'width'>> };

export type MediaFieldsByTypeFragment = MediaFieldsByType_ExternalVideo_Fragment | MediaFieldsByType_MediaImage_Fragment | MediaFieldsByType_Model3d_Fragment | MediaFieldsByType_Video_Fragment;

export type GetProductsQueryVariables = StorefrontTypes.Exact<{
  first?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['Int']['input']>;
}>;


export type GetProductsQuery = { products: { edges: Array<{ node: (
        Pick<StorefrontTypes.Product, 'id' | 'title'>
        & { variantsCount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Count, 'count'>>, selectedOrFirstAvailableVariant?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ProductVariant, 'id'>>, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount'> }, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'url'>> }
      ) }> } };

interface GeneratedQueryTypes {
  "\n  #graphql\n  query productRecommendations($productId: ID!) {\n    productRecommendations(productId: $productId) {\n      id\n      featuredImage {\n        altText\n        url\n      }\n      title\n      priceRange {\n        minVariantPrice {\n          amount\n        }\n      }\n      selectedOrFirstAvailableVariant {\n        id\n      }\n      variantsCount {\n        count\n      }\n    }\n  }\n  ": {return: ProductRecommendationsQuery, variables: ProductRecommendationsQueryVariables},
  "#graphql\n    query Product(\n        $id: ID!\n        $selectedOptions: [SelectedOptionInput!]!\n      ) {\n        product(id: $id) {\n          id\n          title\n          description\n          options {\n            name\n            optionValues {\n              name\n            }\n          }\n          selectedVariant: selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions) {\n            id\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n          }\n          variants(first: 10) {\n            edges {\n              node {\n                id\n                title\n                quantityAvailable\n                price {\n                  amount\n                  currencyCode\n                  }\n                selectedOptions {\n                  name\n                  value\n                }\n                availableForSale\n              }\n            }\n          }\n          media(first: 10) {\n            edges {\n              node {\n                mediaContentType\n                alt\n                ...mediaFieldsByType\n              }\n            }\n          }\n          seo {\n            description\n            title\n          }\n        }\n      }\n      fragment mediaFieldsByType on Media {\n        ... on ExternalVideo {\n          id\n          embeddedUrl\n        }\n        ... on MediaImage {\n          image {\n            url\n          }\n        }\n        ... on Model3d {\n          sources {\n            url\n            mimeType\n            format\n            filesize\n          }\n        }\n        ... on Video {\n          sources {\n            url\n            mimeType\n            format\n            height\n            width\n          }\n        }\n      }\n    ": {return: ProductQuery, variables: ProductQueryVariables},
  "#graphql\n    query getProducts($first: Int) {\n    products(first: $first) {\n      edges {\n        node {\n          id\n          title\n          variantsCount {\n            count\n          }\n          selectedOrFirstAvailableVariant {\n            id\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n            }\n          }\n          featuredImage {\n            altText\n            height\n            width\n            url\n          }\n        }\n      }\n    }\n  }": {return: GetProductsQuery, variables: GetProductsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
