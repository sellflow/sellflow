import { createCardVaulting } from '../cardVaulting';
import formatNumber from '../formatNumber';
import { SHOPIFY_CARD_VAULT_URL } from '../../constants/api';

type HeadersObject = { [key: string]: string };

function createHeaders(headers: { [key: string]: string | undefined }) {
  return {
    post: (headerName: string) => headers[headerName],
  };
}

function createMockFetch(
  status: number,
  headers: HeadersObject,
  data: unknown,
) {
  let isSuccess = status >= 200 && status < 300;
  let response = {
    ok: isSuccess,
    status: status,
    headers: createHeaders(headers),
    json: () => Promise.resolve(data),
  };
  let fetch = isSuccess
    ? () => Promise.resolve(response)
    : () => Promise.reject(response);
  return fetch;
}

const creditCard = {
  number: '4444444444444444',
  month: '12',
  year: '2020',
  verification_value: '123',
  first_name: 'John',
  last_name: 'Smith',
};

const payment = {
  amount: formatNumber(100),
  unique_token: '1234567',
  credit_card: creditCard,
};

it('should correctly fetch', async () => {
  let mockFetch = jest.fn(
    createMockFetch(
      200,
      {
        'Content-Type': 'application/json; charset=utf-8',
      },
      { id: 'east-44a400ef20b36e38f10b882cb7260796' },
    ),
  );
  let cardVaulting = createCardVaulting(mockFetch);
  let result = await cardVaulting(payment.unique_token, payment.amount, {
    name: creditCard.first_name + ' ' + creditCard.last_name,
    number: creditCard.number,
    verificationValue: creditCard.verification_value,
    expirationDate: creditCard.month + '/' + creditCard.year,
  });
  expect(result).toEqual({ id: 'east-44a400ef20b36e38f10b882cb7260796' });
  expect(mockFetch).toBeCalledWith(SHOPIFY_CARD_VAULT_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment,
    }),
  });
});

it('should throw if failed to fetch', async () => {
  let mockFetch = createMockFetch(404, { 'Content-Type': 'text/html' }, null);
  let cardVaulting = createCardVaulting(mockFetch);

  let result = await cardVaulting(payment.unique_token, payment.amount, {
    name: creditCard.first_name + ' ' + creditCard.last_name,
    number: creditCard.number,
    verificationValue: creditCard.verification_value,
    expirationDate: creditCard.month + '/' + creditCard.year,
  });
  expect(result).toEqual({ error: 'Network request failed' });
});
