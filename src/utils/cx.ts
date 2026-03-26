type ClassValue =
  | string
  | null
  | undefined
  | false
  | Record<string, boolean>;

export function cx(...args: ClassValue[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === "string") return [arg];
      if (typeof arg === "object") {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}
