import React from 'react';
import { render } from 'react-native-testing-library';

import { MockedProvider } from '@apollo/react-testing';

import { ProductItem, ProductList } from '../';
import { MOCKED_SHOP } from '../../__mocks__/mockedData';
import wait from '../../__mocks__/wait';
import { wishlist } from '../../fixtures/wishlist';
import { setDefaultCountryResolver } from '../../graphql/resolvers/setDefaultCountryResolver';

test('should render normally with discount', async () => {
  let { getAllByType } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCountry: setDefaultCountryResolver,
        },
      }}
    >
      <ProductList data={wishlist} numColumns={3} onItemPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getAllByType(ProductItem).length).toEqual(wishlist.length);
});
