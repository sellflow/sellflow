import { ShoppingCartReplaceItem_checkoutLineItemsReplace_checkout_lineItems as CartReplaceLineItems } from '../generated/server/ShoppingCartReplaceItem';
import { ShoppingCartCreate_checkoutCreate_checkout_lineItems as CartCreateLineItems } from '../generated/server/ShoppingCartCreate';
import { GetOrderHistory_customer_orders_edges_node_lineItems as OrderHistoryLineItems } from '../generated/server/GetOrderHistory';
import { LineItem } from '../types/types';

type CompatibleType =
  | CartReplaceLineItems
  | CartCreateLineItems
  | OrderHistoryLineItems;

// the code below this is like that because somehow the CartCreateLineItems edges not detected
type MyEdges = CompatibleType['edges'];
type MyEdge = MyEdges[0] | CartCreateLineItems['edges'][0];

function getEdges(i: CompatibleType): Array<MyEdge> {
  return i.edges;
}

export function mapToLineItems(lineItems: CompatibleType): Array<LineItem> {
  return getEdges(lineItems).map(
    ({ node }): LineItem => {
      let { quantity, title, variant } = node;
      let image = '';
      let priceAfterDiscount = 0;
      let originalPrice = 0;
      let variantID = '';
      let variants = '';
      if (variant) {
        let { compareAtPriceV2, priceV2, id, selectedOptions } = variant;

        let price = Number(priceV2.amount);
        let compareAtPrice = Number(
          compareAtPriceV2 ? compareAtPriceV2.amount : 0,
        );

        variantID = id;
        let allVariants = selectedOptions.map(
          ({ name, value }) => `${name} ${value}`,
        );
        variants = allVariants.join(', ');
        if (variant.image) {
          image = variant.image.transformedSrc;
          priceAfterDiscount = compareAtPriceV2 ? price : 0;
        }
        if (compareAtPriceV2) {
          originalPrice = compareAtPrice;
        } else {
          originalPrice = price;
        }
      }

      return {
        variant: variants,
        variantID,
        title,
        image,
        originalPrice,
        priceAfterDiscount,
        quantity,
      };
    },
  );
}
