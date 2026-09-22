export function getValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<any>((current, key) => current?.[key], obj);
}

/*
  Usage:
  getValue({user: { name: "Michael" } }, 'user.name)
*/
