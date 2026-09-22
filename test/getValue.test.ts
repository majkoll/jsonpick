import assert from "node:assert/strict";
import test from "node:test";

import { getValue } from "../src/getValue.ts";

test("gets a nested object value", () => {
  const value = getValue(
    { user: { profile: { name: "Ada" } } },
    "user.profile.name",
  );

  assert.equal(value, "Ada");
});

test("gets an array item with a numeric path segment", () => {
  const value = getValue(
    {
      members: [
        { id: 1, name: "one" },
        { id: 2, name: "two" },
      ],
    },
    "members.1.name",
  );

  assert.equal(value, "two");
});

test("gets an item from a root array", () => {
  const value = getValue([{ name: "one" }, { name: "two" }], "0.name");

  assert.equal(value, "one");
});

test("returns undefined when a path does not exist", () => {
  const value = getValue({ user: {} }, "user.profile.name");

  assert.equal(value, undefined);
});
