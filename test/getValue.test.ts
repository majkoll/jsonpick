import assert from "node:assert/strict";
import test from "node:test";

import { getValue } from "../src/getValue.ts";

test("gets a nested object value", () => {
  const value = getValue({ user: { profile: { name: "Ada" } } }, "user.profile.name");

  assert.equal(value, "Ada");
});

test("gets an array item", () => {
  const value = getValue({ users: [{ name: "Ada" }] }, "users.0.name");

  assert.equal(value, "Ada");
});

test("returns undefined when a path does not exist", () => {
  const value = getValue({ user: {} }, "user.profile.name");

  assert.equal(value, undefined);
});
