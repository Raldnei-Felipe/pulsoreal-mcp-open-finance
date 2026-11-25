import { beforeEach, describe, expect, it } from "vitest";
import { createThread, loadThreads, saveThreads } from "./conversationStore";

describe("Browser conversation history", () => {
  beforeEach(() => localStorage.clear());
  it("creates only one default conversation across repeated bootstraps", () => {
    const first = loadThreads();
    const second = loadThreads();
    expect(first.threads).toHaveLength(1);
    expect(second.threads).toHaveLength(1);
    expect(second.threads[0]?.id).toBe(first.threads[0]?.id);
  });
  it("restores each conversation without mixing messages", () => {
    const first = createThread("first");
    const second = createThread("second");
    first.messages = [
      {
        id: "m1",
        role: "user",
        parts: [{ type: "text", text: "Quanto tenho realmente livre hoje?" }],
      },
    ];
    second.messages = [
      {
        id: "m2",
        role: "user",
        parts: [{ type: "text", text: "Posso assumir uma despesa de US$ 150 agora?" }],
      },
    ];
    saveThreads([first, second]);
    const restored = loadThreads("second");
    expect(restored.threads.find((thread) => thread.id === "first")?.messages).toEqual(
      first.messages,
    );
    expect(restored.threads.find((thread) => thread.id === "second")?.messages).toEqual(
      second.messages,
    );
  });
  it("does not replace an unknown URL with a new conversation", () => {
    expect(loadThreads("missing").threads).toHaveLength(0);
    expect(localStorage.length).toBe(0);
  });
  it("reports invalid history without overwriting stored data", () => {
    localStorage.setItem("pulsoreal.conversations.v1", "invalid");
    expect(loadThreads().error).not.toBeNull();
    expect(localStorage.getItem("pulsoreal.conversations.v1")).toBe("invalid");
  });
});
