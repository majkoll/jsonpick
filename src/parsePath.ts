export function parsePath(path: string): string[] {
  const keys: string[] = [];
  let index = 0;

  while (index < path.length) {
    // This catches empty segments in paths such as `.user.name` and `user..name`.
    if (path[index] === ".") {
      throw new Error(`Invalid path: empty segment in ${path}`);
    }

    // Does this segment begin with a double quote?
    // Quoted segments keep dots inside a key name, such as `"basic.info"`.
    if (path[index] === '"') {
      const start = index;
      index += 1;

      while (index < path.length) {
        // Is the current character a backslash escape, such as `\"`?
        // Skip it and the escaped character so that escaped quotes do not end the segment.
        if (path[index] === "\\") {
          index += 2;
          continue;
        }

        // Is this an unescaped double quote?
        // It marks the end of the quoted segment.
        if (path[index] === '"') {
          break;
        }

        index += 1;
      }

      // Did we reach the end of the path before finding the closing double quote?
      if (index >= path.length) {
        throw new Error(`Invalid path: unterminated quoted segment in ${path}`);
      }

      const quotedKey = path.slice(start, index + 1);

      try {
        keys.push(JSON.parse(quotedKey) as string);
      } catch {
        throw new Error(`Invalid path: invalid quoted segment in ${path}`);
      }

      index += 1;

      // If there is more path text, is the next character a dot separator?
      // For example, `"key"next` is invalid because it is missing a dot.
      if (index < path.length && path[index] !== ".") {
        throw new Error(
          `Invalid path: expected a dot after quoted segment in ${path}`,
        );
      }
    } else {
      const start = index;

      while (index < path.length && path[index] !== ".") {
        // Did a quote appear in the middle of an unquoted segment?
        // Quotes are valid only when they wrap the whole segment.
        if (path[index] === '"') {
          throw new Error(
            `Invalid path: quotes must wrap an entire segment in ${path}`,
          );
        }

        index += 1;
      }

      keys.push(path.slice(start, index));
    }

    // Have we finished parsing the final segment?
    if (index === path.length) {
      break;
    }

    // The current character is a `.` separator, so move to the next segment.
    index += 1;

    // Did the path end immediately after a dot, as in `user.name.`?
    if (index === path.length) {
      throw new Error(`Invalid path: trailing dot in ${path}`);
    }
  }

  return keys;
}
