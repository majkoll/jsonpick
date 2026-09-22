#!/usr/bin/env node
import { createRequire } from "node:module";

import { loadJson } from "./loadJson.ts";
import { getValue } from "./getValue.ts";

const require = createRequire(import.meta.url);
const { version } = require("jsonpick/package.json") as { version: string };

const HELP = `Usage: jsonpick [file|url] path

Read a value from JSON using a dot-separated path.

Arguments:
  file|url    A local JSON file or HTTP(S) URL. Omit it to read JSON from stdin.
  path        A dot-separated path, such as user.name or members.0.name.

Options:
  -h, --help     Show this help message.
  -v, --version  Show the jsonpick version.

Examples:
  jsonpick package.json version
  jsonpick data.json user.name
  jsonpick data.json members.0.name
  cat data.json | jsonpick user.name
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
    console.log(HELP);
    return;
  }

  if (args.length === 1 && ["-v", "--version"].includes(args[0])) {
    console.log(version);
    return;
  }

  let source: string | undefined;
  let path: string;

  if (args.length === 1) {
    path = args[0];
  } else if (args.length === 2) {
    source = args[0];
    path = args[1];
  } else {
    console.error(`Usage: jsonpick [file|url] path`);

    process.exit(1);
    return;
  }

  const json = await loadJson(source);
  const value = await getValue(json, path);

  if (value === undefined) {
    console.error(`Path not found: ${path}`);

    process.exit(1);
    return;
  }

  if (typeof value === "object") {
    console.log(JSON.stringify(value, null, 2));
  } else {
    console.log(value);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
