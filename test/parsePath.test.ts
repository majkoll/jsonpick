import assert from "node:assert/strict";
import test from "node:test";

import { parsePath } from "../src/parsePath.ts";

test("parses ordinary dot-separated segments", () => {
  const result = parsePath("majk.t");

  assert.deepEqual(result, ["majk", "t"]);
});

test("parses an array index segment", () => {
  const result = parsePath("systems.1.name");

  assert.deepEqual(result, ["systems", "1", "name"]);
});

test("keeps a quoted key containing a dot as one segment", () => {
  const result = parsePath('systems.1."basic.info"');

  assert.deepEqual(result, ["systems", "1", "basic.info"]);
});

test("parses a quoted key at the root", () => {
  const result = parsePath('"build.info".version');

  assert.deepEqual(result, ["build.info", "version"]);
});
