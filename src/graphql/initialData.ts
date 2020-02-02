import { LocalData } from '../types/types';

export const initialData: LocalData = {
  customer: {
    __typename: 'Customer',
    email: '',
    id: '',
    expiresAt: '',
    firstName: '',
    lastName: '',
  },
  wishlist: [],
};
