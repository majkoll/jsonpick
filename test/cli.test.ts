import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = fileURLToPath(new URL("../src/cli.ts", import.meta.url));
const fixturePath = fileURLToPath(
  new URL("./fixtures/data.json", import.meta.url),
);

function runCli(args: string[], input?: string) {
  return spawnSync(process.execPath, ["--import", "tsx", cliPath, ...args], {
    cwd: projectRoot,
    encoding: "utf-8",
    input,
    timeout: 10_000,
  });
}

test("prints a nested value from a JSON file", () => {
  const result = runCli([fixturePath, "user.name"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Ada\n");
  assert.equal(result.stderr, "");
});

test("prints object values as formatted JSON", () => {
  const result = runCli([fixturePath, "user.roles"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '[\n  "admin",\n  "editor"\n]\n');
});

test("reads JSON from standard input when no source is supplied", () => {
  const result = runCli(["user.name"], '{"user":{"name":"Grace"}}');

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Grace\n");
});

test("prints a value from a JSON URL", () => {
  const result = runCli([
    "https://jsonplaceholder.typicode.com/users/1",
    "name",
  ]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Leanne Graham\n");
  assert.equal(result.stderr, "");
});

test("reports a missing path", () => {
  const result = runCli([fixturePath, "user.email"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Path not found: user.email\n");
});

test("reports usage when called with no arguments", () => {
  const result = runCli([]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Usage: jsonpick [file|url] path\n");
});
