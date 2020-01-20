const monthNames = [
  t('January'),
  t('February'),
  t('March'),
  t('April'),
  t('May'),
  t('June'),
  t('July'),
  t('August'),
  t('September'),
  t('October'),
  t('November'),
  t('December'),
];

export default function formatDateLong(input: string) {
  let date = new Date(input);
  if (isNaN(date.valueOf())) {
    return '';
  }
  let month = monthNames[date.getMonth()] || '';
  let day = date.getDate();
  let year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
