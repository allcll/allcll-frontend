export function formatMultiSelectedLabel<T>(label: string, selectedValues: T[], format?: (value: T) => string) {
  if (selectedValues.length === 0) return label;

  const firstLabel = format?.(selectedValues[0]) ?? label;
  if (selectedValues.length === 1) return firstLabel;
  return `${firstLabel} 외 ${selectedValues.length - 1}개`;
}
