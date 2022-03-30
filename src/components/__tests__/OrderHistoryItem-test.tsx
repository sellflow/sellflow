import React from 'react';
import { render } from 'react-native-testing-library';

import { MockedProvider } from '@apollo/react-testing';

import { OrderHistoryItem } from '../';
import { MOCKED_SHOP } from '../../__mocks__/mockedData';
import wait from '../../__mocks__/wait';
import { orderHistory } from '../../fixtures/OrderHistoryItem';
import { setDefaultCountryResolver } from '../../graphql/resolvers/setDefaultCountryResolver';

test('should render normally', async () => {
  let { getByText } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCountry: setDefaultCountryResolver,
        },
      }}
    >
      <OrderHistoryItem order={orderHistory} onPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getByText(`Order ${orderHistory.orderNumber}`)).toBeTruthy();
});
