import { Card } from 'card-validator';

import { cleanNumber, limitLength } from './utilities';

export default function formatCardNumber(
  cardNumber: string,
  card: Card | null,
) {
  let formattedCardNumber = cleanNumber(cardNumber);

  if (card) {
    let maxLength = card.lengths[card.lengths.length - 1];
    let cleaned = limitLength(formattedCardNumber, maxLength);

    let addGaps = (cardNumber: string, gaps: Array<number>) => {
      let offsets = [0, ...gaps, cardNumber.length];

      return offsets
        .map((end, index) => {
          if (index === 0) {
            return '';
          }
          let start = offsets[index - 1];
          return cardNumber.substr(start, end - start);
        })
        .join(' ')
        .trim();
    };
    formattedCardNumber = addGaps(cleaned, card.gaps);
  }

  return formattedCardNumber;
}
