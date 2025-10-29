export function mergeDefined<T>(target: T, source: Partial<T>): T {
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined) {
      (target as any)[key] = value;
    }
  }
  return target;
}
