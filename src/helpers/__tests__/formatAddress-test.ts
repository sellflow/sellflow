import formatAddress from '../formatAddress';

it('should format and combine the address ', () => {
  // Data from Shopify API
  let address = {
    id: '207119551',
    customer_id: 207119551,
    firstName: '',
    lastName: '',
    company: null,
    address1: 'Chestnut Street 92',
    address2: '',
    city: 'Louisville',
    province: 'Kentucky',
    country: 'United States',
    zip: '40202',
    phone: '555-625-1199',
    name: '',
    province_code: 'KY',
    country_code: 'US',
    country_name: 'United States',
    default: true,
  };

  expect(formatAddress(address)).toEqual([
    'Chestnut Street 92',
    'Louisville, Kentucky 40202',
    'United States',
  ]);
});
