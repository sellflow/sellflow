import { SHOPIFY_CARD_VAULT_URL } from '../constants/api';

export type CreditCard = {
  number: string;
  verificationValue: string;
  name: string;
  expirationDate: string;
};

export function createCardVaulting(fetch: Function) {
  async function cardVaulting(
    id: string,
    amount: string,
    creditCard: CreditCard,
  ) {
    try {
      let { number, verificationValue, name, expirationDate } = creditCard;
      let [firstName, ...lastName] = name.split(' ');
      let [month, year] = expirationDate.split('/');

      let requestBody = {
        payment: {
          amount,
          unique_token: id,
          credit_card: {
            number,
            month,
            year,
            verification_value: verificationValue,
            first_name: firstName,
            last_name: lastName.join(' '),
          },
        },
      };
      let response = await fetch(SHOPIFY_CARD_VAULT_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      let result = await response.json();
      return result;
    } catch (error) {
      return { error: 'Network request failed' };
    }
  }
  return cardVaulting;
}
export default createCardVaulting(fetch);
