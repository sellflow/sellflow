/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types';

export type ProductQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
  selectedOptions: Array<StorefrontTypes.SelectedOptionInput> | StorefrontTypes.SelectedOptionInput;
}>;


export type ProductQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'title' | 'handle' | 'description'>
    & { options: Array<(
      Pick<StorefrontTypes.ProductOption, 'name'>
      & { optionValues: Array<Pick<StorefrontTypes.ProductOptionValue, 'name'>> }
    )>, selectedVariant?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.ProductVariant, 'availableForSale'>
      & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
    )>, variants: { edges: Array<{ node: (
          Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
          & { priceV2: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
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
        Pick<StorefrontTypes.Product, 'handle' | 'title'>
        & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'url'>> }
      ) }> } };

interface GeneratedQueryTypes {
  "#graphql\n    query Product(\n        $handle: String!\n        $selectedOptions: [SelectedOptionInput!]!\n      ) {\n        product(handle: $handle) {\n          id\n          title\n          handle\n          description\n          options {\n            name\n            optionValues {\n              name\n            }\n          }\n          selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n          }\n          variants(first: 10) {\n            edges {\n              node {\n                id\n                title\n                priceV2 {\n                  amount\n                  currencyCode\n                  }\n                selectedOptions {\n                  name\n                  value\n                }\n                availableForSale\n              }\n            }\n          }\n          media(first: 10) {\n            edges {\n              node {\n                mediaContentType\n                alt\n                ...mediaFieldsByType\n              }\n            }\n          }\n          seo {\n            description\n            title\n          }\n        }\n      }\n      fragment mediaFieldsByType on Media {\n        ... on ExternalVideo {\n          id\n          embeddedUrl\n        }\n        ... on MediaImage {\n          image {\n            url\n          }\n        }\n        ... on Model3d {\n          sources {\n            url\n            mimeType\n            format\n            filesize\n          }\n        }\n        ... on Video {\n          sources {\n            url\n            mimeType\n            format\n            height\n            width\n          }\n        }\n      }\n    ": {return: ProductQuery, variables: ProductQueryVariables},
  "#graphql\n    query getProducts($first: Int) {\n    products(first: $first) {\n      edges {\n        node {\n          handle\n          title\n          featuredImage {\n            altText\n            height\n            width\n            url\n          }\n        }\n      }\n    }\n  }": {return: GetProductsQuery, variables: GetProductsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
