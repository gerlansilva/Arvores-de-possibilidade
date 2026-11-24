export function plural(n: number, singular: string, plurais: string): string {
  return `${n} ${n === 1 ? singular : plurais}`;
}
