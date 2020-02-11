import { useLazyQuery, QueryHookOptions } from '@apollo/react-hooks';

import {
  GetOrderHistory,
  GetOrderHistoryVariables,
} from '../../generated/server/GetOrderHistory';
import { GET_ORDER_HISTORY } from '../../graphql/server/orderHistory';
import { OrderRecord } from '../../types/types';

function getOrders(
  customerData: GetOrderHistory | undefined,
): Array<OrderRecord> {
  if (customerData) {
    if (customerData.customer) {
      return customerData.customer.orders.edges.map((order) => {
        return {
          orderID: order.node.id,
          orderNumber: `#${order.node.orderNumber.toString()}`,
          orderTime: order.node.processedAt,
          totalPayment: Number(order.node.totalPriceV2.amount),
        };
      });
    }
  }
  return [];
}

function useOrderHistoryQuery(
  options?: QueryHookOptions<GetOrderHistory, GetOrderHistoryVariables>,
) {
  let [getOrderHistory, { data }] = useLazyQuery<
    GetOrderHistory,
    GetOrderHistoryVariables
  >(GET_ORDER_HISTORY, options);

  return { getOrderHistory, orders: getOrders(data) };
}

export { useOrderHistoryQuery };
