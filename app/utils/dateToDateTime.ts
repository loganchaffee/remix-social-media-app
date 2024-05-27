export function dateToDatetime(date: Date) {
  const padZero = (num: number) => (num < 10 ? "0" + num : num);

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-based in JS
  const day = padZero(date.getDate());

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
