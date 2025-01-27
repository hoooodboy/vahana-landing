import dayjs from "dayjs";

export type GetDateTimeStringOptions = {
  hideTime?: boolean;
  format?: "YY/MM/DD" | "YYYY-MM-DD" | "YYYY.MM.DD" | "MM.DD" | "YYYY/MM/DD";
};
function getDateTimeString(
  date: Date | string | null | undefined,
  options: GetDateTimeStringOptions = {}
) {
  if (!date) {
    return undefined;
  }

  const format = options?.format ?? "YY/MM/DD";

  if (options.hideTime) {
    return dayjs(date).format(format);
  }
  return dayjs(date).format(`${format} HH:mm`);
}

export default getDateTimeString;
