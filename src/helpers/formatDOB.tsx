export default function formatDOB(input: string) {
  let formattedDOB;
  let date = new Date(input);
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

  let month = monthNames[date.getMonth()] || '';

  let day = date.getDate();
  let year = date.getFullYear();
  formattedDOB = `${month} ${day}, ${year}`;
  if (isNaN(date.valueOf())) {
    formattedDOB = '';
  }
  return formattedDOB;
}
