import valid from 'card-validator';

export default function formatCardNumber(cardNumber: string) {
  let nonNumberRemoved = cardNumber.replace(/[^\d]/g, '');
  let { card } = valid.number(nonNumberRemoved);

  if (card) {
    let maxLength = card.lengths[card.lengths.length - 1];
    let cleaned = nonNumberRemoved.slice(0, maxLength);

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
    return addGaps(cleaned, card.gaps);
  }
  return nonNumberRemoved;
}
