import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = fileURLToPath(new URL("../src/cli.ts", import.meta.url));
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
) as { version: string };
const fixturePath = fileURLToPath(
  new URL("./fixtures/data.json", import.meta.url),
);
const invalidFixturePath = fileURLToPath(
  new URL("./fixtures/invalid.json", import.meta.url),
);
const missingFixturePath = fileURLToPath(
  new URL("./fixtures/missing.json", import.meta.url),
);

function runCli(args: string[], input?: string) {
  return spawnSync(process.execPath, ["--import", "tsx", cliPath, ...args], {
    cwd: projectRoot,
    encoding: "utf-8",
    input,
    timeout: 10_000,
  });
}

test("prints help", () => {
  const result = runCli(["--help"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /^Usage: jsonpick \[file\|url\] path/);
  assert.equal(result.stderr, "");
});

test("prints the package version", () => {
  const result = runCli(["--version"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${version}\n`);
  assert.equal(result.stderr, "");
});

test("prints a nested value from a JSON file", () => {
  const result = runCli([fixturePath, "user.name"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Ada\n");
  assert.equal(result.stderr, "");
});

test("prints a value selected with an array index", () => {
  const result = runCli([fixturePath, "members.1.name"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Bar\n");
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

test("reports a missing JSON file", () => {
  const result = runCli([missingFixturePath, "user.name"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^Could not read file .+missing\.json:/);
});

test("reports invalid JSON in a file", () => {
  const result = runCli([invalidFixturePath, "user.name"]);

  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^Could not parse JSON from .+invalid\.json:/);
});

test("reports invalid JSON from standard input", () => {
  const result = runCli(["user.name"], "{not valid JSON}");

  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^Could not parse JSON from standard input:/);
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
