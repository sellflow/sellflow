import React from 'react';
import { render } from 'react-native-testing-library';
import { MockedProvider } from '@apollo/react-testing';

import { MOCKED_SHOP } from '../../__mocks__/mockedData';
import { ProductList, ProductItem } from '..';
import { setDefaultCurrencyResolver } from '../../graphql/resolvers/setDefaultCurrencyResolver';
import wait from '../../__mocks__/wait';
import { wishlist } from '../../fixtures/wishlist';

test('should render normally with discount', async () => {
  let { getAllByType } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCurrency: setDefaultCurrencyResolver,
        },
      }}
    >
      <ProductList data={wishlist} numColumns={3} onItemPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getAllByType(ProductItem).length).toEqual(wishlist.length);
});
