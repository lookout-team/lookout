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
  let unit = units[0];

  for (let i = 0; i < divisors.length; i++) {
    if (duration / divisors[i] < 1) break;
    duration = duration / divisors[i];
    unit = units[i];
  }

  return `${Math.round(duration)} ${unit} ago`;
}

export function handleTextAreaSubmit(e: any, formRef: any) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (formRef && formRef.current) {
      formRef.current.requestSubmit();
    }
  }
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
