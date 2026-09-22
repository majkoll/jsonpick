#!/usr/bin/env node
import { loadJson } from "./loadJson.ts";
import { getValue } from "./getValue.ts";

async function main() {
  const args = process.argv.slice(2);

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
