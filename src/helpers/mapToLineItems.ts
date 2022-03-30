import { GetOrderHistory_customer_orders_edges_node_lineItems as OrderHistoryLineItems } from '../generated/server/GetOrderHistory';
import { ShoppingCartCreate_checkoutCreate_checkout_lineItems as CartCreateLineItems } from '../generated/server/ShoppingCartCreate';
import { ShoppingCartDiscountCodeApply_checkoutDiscountCodeApplyV2_checkout_lineItems as DiscountApplyLineItems } from '../generated/server/ShoppingCartDiscountCodeApply';
import { ShoppingCartReplaceItem_checkoutLineItemsReplace_checkout_lineItems as CartReplaceLineItems } from '../generated/server/ShoppingCartReplaceItem';
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
          compareAtPriceV2,
          priceV2,
          quantityAvailable: stockAvailable,
        } = variant;
        quantityAvailable = stockAvailable ?? 0;
        let priceUsed = Number(priceV2.amount);
        let compareAtPriceUsed = Number(
          compareAtPriceV2 ? compareAtPriceV2.amount : 0,
        );

        if (compareAtPriceV2) {
          priceAfterDiscount = compareAtPriceV2 ? priceUsed : 0;
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
