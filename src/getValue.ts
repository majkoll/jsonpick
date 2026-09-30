import { parsePath } from "./parsePath.ts";

export function getValue(obj: unknown, path: string): unknown {
  return parsePath(path).reduce<any>((current, key) => current?.[key], obj);
}
