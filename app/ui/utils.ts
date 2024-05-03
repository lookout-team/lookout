/**
 * Returns the duration since the given datetime.
 * @param dateTime - Given datetime
 * @returns - Duration since given datetime in string format
 */
export function getDuration(dateTime: Date): string {
  const divisors = [1000, 60, 60, 24, 7, 4];
  const units = ["seconds", "minutes", "hours", "days", "weeks", "months"];

  const diff = Date.now() - dateTime.getTime();
  let duration = diff;
  let unit;

  for (let i = 0; i < divisors.length; i++) {
    if (duration / divisors[i] < 1) break;
    duration = diff / divisors[i];
    unit = units[i];
  }

  return `${duration} ${unit}`;
}
