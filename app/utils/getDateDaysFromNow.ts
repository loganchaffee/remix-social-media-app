export function getDateDaysFromNow(days: number) {
  const currentDate = new Date();
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const targetDate = new Date(
    currentDate.getTime() + days * millisecondsInADay
  );
  return targetDate;
}
