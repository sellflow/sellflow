import { OrderItem as OrderItemType } from '../types/types';

export let OrderData: Array<OrderItemType> = [
  {
    variantID: '92315121',
    itemName: 'Basic T Shirt',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
    itemPrice: 79,
    discount: 10,
    quantity: 2,
    variant: 'Size M Grey',
    cardType: 'checkout',
  },
  {
    variantID: '1162131',
    itemName: 'Basic T Shirt',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
    itemPrice: 79,
    discount: 1,
    quantity: 2,
    variant: 'Size M Grey',
    cardType: 'order',
  },
];

export let OrderData2: Array<OrderItemType> = [
  {
    variantID: '92315121',
    itemName: 'Basic T Shirt',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
    itemPrice: 79,
    discount: 10,
    quantity: 2,
    variant: 'Size M Grey',
    cardType: 'order',
  },
  {
    variantID: '1162131',
    itemName: 'Basic T Shirt',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
    itemPrice: 79,
    discount: 12,
    quantity: 2,
    variant: 'Size M Grey',
    cardType: 'order',
  },
];
