/** Une clases condicionales sin arrastrar una dependencia extra. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
