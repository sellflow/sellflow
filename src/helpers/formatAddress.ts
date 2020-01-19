import { AddressItem } from '../types/types';

export default function formatAddress({
  address1,
  city,
  province,
  zip,
  country,
}: AddressItem) {
  return [address1, `${city}, ${province} ${zip}`, country];
}
