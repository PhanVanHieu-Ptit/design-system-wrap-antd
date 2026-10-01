const seen = new Set<string>();

/** Dev-only, de-duplicated warning. Stripped to a no-op in production builds. */
export function warning(valid: boolean, component: string, message: string): void {
  if (process.env.NODE_ENV === 'production' || valid) return;
  const text = `[@hieu/ui: ${component}] ${message}`;
  if (seen.has(text)) return;
  seen.add(text);
  console.error(`Warning: ${text}`);
}
