import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const cliPath = fileURLToPath(new URL("../../src/cli.ts", import.meta.url));

test("prints a value from a JSONPlaceholder URL", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      cliPath,
      "https://jsonplaceholder.typicode.com/users/1",
      "name",
    ],
    {
      cwd: projectRoot,
      encoding: "utf-8",
      timeout: 10_000,
    },
  );

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Leanne Graham\n");
  assert.equal(result.stderr, "");
});
