export function useNumber(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }
  if (value === undefined) {
    return 0;
  }
  return parseInt(value.replace(/,/g, ""), 10);
}
