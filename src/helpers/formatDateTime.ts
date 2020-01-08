export default function formatDateTime(datetime: string) {
  let date = new Date(datetime);
  let day = ('0' + date.getDate()).slice(-2);
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let hours = ('0' + date.getHours()).slice(-2);
  let minutes = ('0' + date.getMinutes()).slice(-2);

  return `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}`;
}
