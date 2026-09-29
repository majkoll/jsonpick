import assert from "node:assert/strict";
import test from "node:test";

import { loadJson } from "../src/loadJson.ts";

function mockFetch(response: Response): () => void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => response;

  return () => {
    globalThis.fetch = originalFetch;
  };
}

test("reports an unsuccessful HTTP response", async () => {
  const source = "https://example.test/missing.json";
  const restoreFetch = mockFetch(
    new Response(null, { status: 404, statusText: "Not Found" }),
  );

  try {
    await assert.rejects(loadJson(source), {
      message: `Could not fetch ${source}: HTTP 404 Not Found`,
    });
  } finally {
    restoreFetch();
  }
});

test("reports invalid JSON from a URL", async () => {
  const source = "https://example.test/invalid.json";
  const restoreFetch = mockFetch(new Response("{not valid JSON}"));

  try {
    await assert.rejects(loadJson(source), {
      message: /Could not parse JSON from https:\/\/example\.test\/invalid\.json:/,
    });
  } finally {
    restoreFetch();
  }
});
