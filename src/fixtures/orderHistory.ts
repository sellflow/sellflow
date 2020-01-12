import { OrderRecord } from '../types/types';
import formatDateTime from '../helpers/formatDateTime';

export const orders: Array<OrderRecord> = [
  {
    orderID: '#8899112233',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
  {
    orderID: '#8899112234',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$18.99',
  },
  {
    orderID: '#8899112235',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$16.99',
  },
  {
    orderID: '#8899112236',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
  {
    orderID: '#8899112237',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
  {
    orderID: '#8899112238',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
  {
    orderID: '#8899112239',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
  {
    orderID: '#8899112230',
    orderTime: formatDateTime(new Date().toISOString()),
    totalPayment: '$17.99',
  },
];
