export function formatNames(names: string[]): string {
  if (names.length <= 2) {
    return names.join(", ");
  }

  const numOthers = names.length - 2;
  return `${names[0]}, ${names[1]}, and ${numOthers} more`;
}
