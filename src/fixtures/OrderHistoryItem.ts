import { OrderRecord } from '../types/types';

export let orderHistory: OrderRecord = {
  orderID:
    'Z2lkOi8vc2hvcGlmeS9PcmRlci8xOTg1NzQ4Njk3MjI0P2tleT0yMDU3ZjNkMDI3ODIwNjk3Mjc2ZGJjMDQyZmVlOGZiNg==',
  orderNumber: '#1004',
  orderTime: '2020-02-11T05:16:43Z',
  shippingPrice: 34.27,
  subtotalPayment: 24,
  totalPayment: 58.27,
  address: {
    address1: '3101 Park Blvd',
    city: 'Palo Alto',
    country: 'United States',
    id:
      'Z2lkOi8vc2hvcGlmeS9NYWlsaW5nQWRkcmVzcy81NTgzNjQ2OTE2NzQ0P21vZGVsX25hbWU9QWRkcmVzcw==',
    name: 'Charles Barnes',
    firstName: 'Charles',
    lastName: 'Barnes',
    phone: '801-429-4555',
    province: 'California',
    zip: '94301',
  },
  lineItems: [
    {
      image:
        'https://cdn.shopify.com/s/files/1/0316/3675/0472/products/00000000_zi_0ec1dfc5-ed5f-40ea-a5fd-a3d7e9b40461.jpg?v=1580283553',
      originalPrice: 8,
      priceAfterDiscount: 6,
      quantity: 1,
      quantityAvailable: 100,
      title: 'Earring',
      variant: 'Title Default Title',
      variantID: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjAzNjA5NTU5MDUzNg==',
    },
  ],
};
