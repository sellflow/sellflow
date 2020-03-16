import React from 'react';
import { render } from 'react-native-testing-library';
import { MockedProvider } from '@apollo/react-testing';

import { orderHistory } from '../../fixtures/OrderHistoryItem';
import { OrderHistoryItem } from '..';
import { MOCKED_SHOP } from '../../__mocks__/mockedData';
import { setDefaultCurrencyResolver } from '../../graphql/resolvers/setDefaultCurrencyResolver';
import wait from '../../__mocks__/wait';

test('should render normally', async () => {
  let { getByText } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCurrency: setDefaultCurrencyResolver,
        },
      }}
    >
      <OrderHistoryItem order={orderHistory} onPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getByText(`Order ${orderHistory.orderNumber}`)).toBeTruthy();
});
