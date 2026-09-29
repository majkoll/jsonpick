#!/usr/bin/env node
import { createRequire } from "node:module";

import { loadJson } from "./loadJson.ts";
import { getValue } from "./getValue.ts";

const require = createRequire(import.meta.url);
const { version } = require("@majkoll/jsonpick/package.json") as {
  version: string;
};

const HELP = `Usage: jsonpick [--compact|-c] [file|url|-] path

Read a value from JSON using a dot-separated path.

Arguments:
  file|url|-  A local JSON file, HTTP(S) URL, or - for standard input.
  path        A dot-separated path, such as user.name or members.0.name.

Options:
  -h, --help     Show this help message.
  -v, --version  Show the jsonpick version.
  -c, --compact  Print arrays and objects as compact JSON.

Examples:
  jsonpick package.json version
  jsonpick data.json user.name
  jsonpick data.json members.0.name
  cat data.json | jsonpick user.name
  jsonpick --compact data.json user.roles
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

  if (args.length === 1 && ["-c", "--compact"].includes(args[0])) {
    console.log(HELP);
    return;
  }

  const compact = args.includes("-c") || args.includes("--compact");
  const positionalArgs = args.filter(
    (arg) => arg !== "-c" && arg !== "--compact",
  );
  let source: string | undefined;
  let path: string;

  if (positionalArgs.length === 1) {
    path = positionalArgs[0];
  } else if (positionalArgs.length === 2) {
    source = positionalArgs[0] === "-" ? undefined : positionalArgs[0];
    path = positionalArgs[1];
  } else {
    console.error(`Usage: jsonpick [--compact|-c] [file|url|-] path`);
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
    console.log(
      compact ? JSON.stringify(value) : JSON.stringify(value, null, 2),
    );
  } else {
    console.log(value);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
