export const assertRequiredApiValue = <T>(value: T, label: string): NonNullable<T> => {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    throw new Error(`${label} is required`);
  }
  return value as NonNullable<T>;
};

export const assertRequiredApiArray = <T>(values: T[] | undefined | null, label: string): T[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${label} is required`);
  }
  values.forEach((value, index) => {
    assertRequiredApiValue(value, `${label}[${index}]`);
  });
  return values;
};
