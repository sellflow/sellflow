import { ShoppingCartReplaceItem_checkoutLineItemsReplace_checkout_lineItems as CartReplaceLineItems } from '../generated/server/ShoppingCartReplaceItem';
import { ShoppingCartCreate_checkoutCreate_checkout_lineItems as CartCreateLineItems } from '../generated/server/ShoppingCartCreate';
import { GetOrderHistory_customer_orders_edges_node_lineItems as OrderHistoryLineItems } from '../generated/server/GetOrderHistory';
import { ShoppingCartDiscountCodeApply_checkoutDiscountCodeApplyV2_checkout_lineItems as DiscountApplyLineItems } from '../generated/server/ShoppingCartDiscountCodeApply';
import { LineItem } from '../types/types';

type CompatibleType =
  | CartCreateLineItems
  | CartReplaceLineItems
  | DiscountApplyLineItems
  | OrderHistoryLineItems;

// the code below this is like that because somehow the CartCreateLineItems edges not detected
type MyEdges = CompatibleType['edges'];
type MyEdge = MyEdges[0] | OrderHistoryLineItems['edges'][0];

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
      let quantityAvailable = 0;
      if (variant) {
        let {
          id,
          selectedOptions,
          presentmentPrices,
          quantityAvailable: stockAvailable,
        } = variant;
        quantityAvailable = stockAvailable ?? 0;
        presentmentPrices.edges[0].node.price?.amount;
        let { compareAtPrice, price } = presentmentPrices.edges[0].node;
        let priceUsed = Number(price.amount);
        let compareAtPriceUsed = Number(
          compareAtPrice ? compareAtPrice.amount : 0,
        );

        if (compareAtPrice) {
          priceAfterDiscount = compareAtPrice ? priceUsed : 0;
          originalPrice = compareAtPriceUsed;
        } else {
          originalPrice = priceUsed;
        }

        variantID = id;
        let allVariants = selectedOptions.map(
          ({ name, value }) => `${name} ${value}`,
        );
        variants = allVariants.join(', ');
        if (variant.image) {
          image = variant.image.transformedSrc;
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
        quantityAvailable,
      };
    },
  );
}
