export function isConvertibleToNumber(value: unknown): value is number {
  return !isNaN(Number(value));
}
