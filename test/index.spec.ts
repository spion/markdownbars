import "jest";
import { handle } from "../src/processor";

describe("markdownbars", () => {
  it("works", () => {
    let res = handle(__dirname + "/fixture/toc.tpl.md", {});
    expect(res).toMatchInlineSnapshot(`
      "
      Things
      - thingy
        - a
          - [x](/a/x.md)
          - [z](/a/z.md)
        - b
          - [y](/b/y.md)
        - [toc.tpl](/toc.tpl.md)"
    `);
  });
});
