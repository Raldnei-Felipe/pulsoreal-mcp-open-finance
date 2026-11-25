import { z } from "zod";
import type { DemoMessage } from "./lenaService";

const partSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({
    type: z.literal("data-financial"),
    data: z.object({
      kind: z.enum(["liquidity", "accounts", "transactions", "patterns", "expense"]),
      amount: z.number().nullable(),
    }),
  }),
]);
const threadSchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.string(),
  messages: z.array(
    z.object({ id: z.string(), role: z.enum(["user", "assistant"]), parts: z.array(partSchema) }),
  ),
});
export interface Thread {
  id: string;
  title: string;
  updatedAt: string;
  messages: DemoMessage[];
}
const key = "pulsoreal.conversations.v1";

export function createThread(id: string = crypto.randomUUID()): Thread {
  return { id, title: "Nova conversa", updatedAt: new Date().toISOString(), messages: [] };
}

export function saveThreads(threads: readonly Thread[]) {
  localStorage.setItem(key, JSON.stringify(threads));
}

// Called only inside ClientOnly. Persist default immediately to make StrictMode bootstrapping idempotent.
export function loadThreads(requestedId?: string): { threads: Thread[]; error: string | null } {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? z.array(threadSchema).safeParse(JSON.parse(raw)) : null;
    if (raw && !parsed?.success)
      return {
        threads: [],
        error:
          "Não foi possível ler o histórico deste navegador. Seus registros foram preservados.",
      };
    const threads: Thread[] = parsed?.success ? parsed.data : [];
    if (threads.length === 0 && !requestedId) {
      const initial = createThread();
      saveThreads([initial]);
      return { threads: [initial], error: null };
    }
    return { threads, error: null };
  } catch {
    return {
      threads: [],
      error:
        "O histórico deste navegador está indisponível. Permita o armazenamento local e tente novamente.",
    };
  }
}
