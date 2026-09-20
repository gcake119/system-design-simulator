import assert from "node:assert/strict";
import test from "node:test";

import { reduceToOutermostNodes } from "./localizationBatch.ts";

class FakeNode {
  readonly name: string;
  readonly descendants: Set<string>;

  constructor(name: string, descendants: Set<string> = new Set()) {
    this.name = name;
    this.descendants = descendants;
  }

  contains(other: FakeNode) {
    return this === other || this.descendants.has(other.name);
  }
}

test("動態加入巢狀 DOM 時只保留最外層節點", () => {
  const leaf = new FakeNode("leaf");
  const child = new FakeNode("child", new Set(["leaf"]));
  const root = new FakeNode("root", new Set(["child", "leaf"]));

  assert.deepEqual(reduceToOutermostNodes([leaf, child, root]), [root]);
});

test("互不包含的節點皆保留", () => {
  const first = new FakeNode("first");
  const second = new FakeNode("second");

  assert.deepEqual(reduceToOutermostNodes([first, second]), [first, second]);
});
