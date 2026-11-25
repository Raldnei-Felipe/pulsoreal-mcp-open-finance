import { describe, expect, it } from "vitest";
import { respondLocally, suggestions, type DemoMessage } from "./lenaService";

const ask = (text: string): DemoMessage =>
  respondLocally([{ id: "user", role: "user", parts: [{ type: "text", text }] }]);
const textOf = (message: DemoMessage) =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");
describe("Local Lena responses", () => {
  it("returns the USD 150 remaining cash without executing an operation", () => {
    expect(textOf(ask(suggestions[4]))).toContain("US$ 55.410,00");
    expect(ask(suggestions[4]).parts).toContainEqual({
      type: "data-financial",
      data: { kind: "expense", amount: 150 },
    });
  });
  it("does not fabricate a financial result outside the sample", () => {
    const result = ask("Qual será minha renda no próximo mês?");
    expect(result.parts.some((part) => part.type === "data-financial")).toBe(false);
  });
  it("maps all five specified queries to their local data views", () => {
    expect(
      suggestions.map(
        (question) => ask(question).parts.find((part) => part.type === "data-financial")?.data.kind,
      ),
    ).toEqual(["liquidity", "accounts", "transactions", "patterns", "expense"]);
  });
});
