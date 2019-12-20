export default function formatDateTime(datetime: string) {
  let date = new Date(datetime);
  let hours = ('0' + date.getHours()).slice(-2);
  let minutes = ('0' + date.getMinutes()).slice(-2);

  return `${date.getDate()}/${date.getMonth() +
    1}/${date.getFullYear()} ${hours}:${minutes}`;
}
