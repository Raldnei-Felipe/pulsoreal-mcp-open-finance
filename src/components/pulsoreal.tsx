import { ClientOnly, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FlaskConical,
  History,
  Info,
  LockKeyhole,
  Menu,
  MessageCircle,
  Plus,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { FinancialResults } from "./financial-results";
import lena from "@/assets/lena-portrait.asset.json";
import { createThread, loadThreads, saveThreads, type Thread } from "@/services/conversationStore";
import { greeting, respondLocally, suggestions, type DemoMessage } from "@/services/lenaService";
import { formatUSD, getFinancialSummary, sampleReference } from "@/services/plaidService";

const suggestionIcons = [Wallet, CreditCard, History, ChartNoAxesCombined, ArrowUpRight];
export function PulsoReal({ threadId }: { threadId?: string }) {
  return (
    <ClientOnly fallback={<div className="loading-screen">PulsoReal · carregando seu painel…</div>}>
      <Workspace {...(threadId ? { threadId } : {})} />
    </ClientOnly>
  );
}

function Workspace({ threadId }: { threadId?: string }) {
  const navigate = useNavigate();
  const [initial] = useState(() => loadThreads(threadId));
  const [threads, setThreads] = useState<Thread[]>(initial.threads);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = threads.find((thread) => thread.id === threadId);

  useEffect(() => {
    const first = threads[0];
    if (!threadId && first)
      void navigate({ to: "/chat/$threadId", params: { threadId: first.id }, replace: true });
  }, [navigate, threadId, threads]);

  function updateThread(updated: Thread) {
    const next = threads.map((thread) => (thread.id === updated.id ? updated : thread));
    try {
      saveThreads(next);
      setStorageError(null);
    } catch {
      setStorageError(
        "Não foi possível salvar esta conversa. Ela permanece aberta, mas pode se perder ao atualizar a página.",
      );
    }
    setThreads(next);
  }
  function newConversation() {
    const thread = createThread();
    const next = [thread, ...threads];
    try {
      saveThreads(next);
      setStorageError(null);
    } catch {
      setStorageError("Não foi possível salvar o histórico neste navegador.");
    }
    setThreads(next);
    setMenuOpen(false);
    void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
  }
  const summary = getFinancialSummary();
  return (
    <div className="app-layout">
      <aside className="sidebar" data-open={menuOpen} aria-label="Histórico de conversas">
        <div className="flex items-center justify-between">
          <Link to="/" className="brand">
            <span className="monogram">PR</span>
            <div>
              <span className="brand-name">PulsoReal</span>
              <div className="brand-caption">Clareza para decidir.</div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="mobile-menu"
            aria-label="Fechar histórico"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </Button>
        </div>
        <div>
          <p className="sidebar-label">Seu espaço</p>
          <nav className="sidebar-nav">
            <Button variant="navigation" className="nav-active" onClick={() => setMenuOpen(false)}>
              <MessageCircle /> Copiloto financeiro <ChevronRight className="ml-auto" />
            </Button>
            <Button
              variant="navigation"
              onClick={() => {
                if (current)
                  updateThread({
                    ...current,
                    messages: [
                      ...current.messages,
                      {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        parts: [
                          {
                            type: "text",
                            text: "Os projetos e contratos não foram fornecidos nesta demonstração. Posso analisar apenas as contas e transações fictícias disponíveis.",
                          },
                        ],
                      },
                    ],
                  });
                setMenuOpen(false);
              }}
            >
              <Wallet /> Projetos e contratos <span className="badge ml-auto">Demo</span>
            </Button>
          </nav>
        </div>
        <div className="min-h-0 flex flex-col gap-3">
          <Button variant="outline" onClick={newConversation}>
            <Plus /> Nova conversa
          </Button>
          <p className="sidebar-label mt-4">Conversas</p>
          <div className="thread-list">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                to="/chat/$threadId"
                params={{ threadId: thread.id }}
                className="thread-link"
                data-active={thread.id === threadId}
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle className="size-3 shrink-0" />
                <span>{thread.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="flex items-center gap-9 mb-4">
            <div className="flex items-center gap-2">
              <span className="lab-mark">
                <FlaskConical className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Plaid Sandbox</p>
                <p className="text-[10px] text-muted-foreground mt-1">Laboratório financeiro</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {sampleReference.mode}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
            <LockKeyhole className="size-3" /> Histórico neste navegador
          </div>
        </div>
      </aside>
      <main className="main-layout">
        <header className="topbar">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="mobile-menu"
              aria-label="Abrir histórico"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
            <div>
              <p className="topbar-title">Seu copiloto financeiro</p>
              <p className="topbar-subtitle">Mais clareza antes do próximo compromisso.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="demo-pill">
              <FlaskConical className="size-3 shrink-0" />
              Ambiente de Demonstração • Dados Fictícios (Plaid Sandbox)
            </span>
            <span className="profile-mark" title="Perfil demonstrativo">
              MEI
            </span>
          </div>
        </header>
        <section className="liquidity-band" aria-label="Termômetro de Liquidez Real vs. Dívidas">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined className="size-4 text-primary" />
              <h2 className="section-eyebrow">Termômetro de Liquidez Real vs. Dívidas</h2>
            </div>
            <span className="badge badge-warning">
              <span className="size-1.5 rounded-full bg-warning" /> Atenção às dívidas
            </span>
          </div>
          <div className="summary-grid">
            <div className="summary-cell">
              <p className="summary-label">
                <Wallet className="size-3" /> Dinheiro disponível
              </p>
              <p className="summary-value text-primary">{formatUSD(summary.liquidity)}</p>
              <p className="summary-note">Liquidez real · 4 contas</p>
            </div>
            <div className="summary-cell">
              <p className="summary-label">
                <CreditCard className="size-3" /> Dívidas totais
              </p>
              <p className="summary-value">{formatUSD(summary.debt)}</p>
              <p className="summary-note">Cartões e empréstimos · 6 contas</p>
            </div>
            <div className="summary-cell">
              <p className="summary-label">
                <ArrowUpRight className="size-3" /> Crédito disponível
              </p>
              <p className="summary-value text-muted-foreground">
                {formatUSD(summary.creditAvailable)}
              </p>
              <p className="summary-note">Não é dinheiro nem patrimônio</p>
            </div>
          </div>
          <div className="liquidity-meter">
            <meter
              aria-label="Liquidez em relação às dívidas"
              min={0}
              max={summary.debt}
              value={summary.liquidity}
            />
            <div className="meter-caption">
              <span>
                Liquidez equivale a{" "}
                {((summary.liquidity / summary.debt) * 100).toFixed(1).replace(".", ",")}% das
                dívidas
              </span>
              <span>USD · sem conversão de moeda</span>
            </div>
          </div>
        </section>
        {storageError && (
          <div className="error-banner mx-4 mt-3" role="alert">
            {storageError}
          </div>
        )}
        {current ? (
          <ChatWindow key={current.id} thread={current} onUpdate={updateThread} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <p>
              {threadId
                ? "Conversa não encontrada neste navegador."
                : "Seu histórico está indisponível."}
            </p>
            <Button onClick={newConversation}>
              <Plus /> Nova conversa
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function ChatWindow({ thread, onUpdate }: { thread: Thread; onUpdate: (thread: Thread) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const latestThread = useRef(thread);
  latestThread.current = thread;
  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function answer(history: DemoMessage[]) {
    pending.current = true;
    setLoading(true);
    setError(null);
    timer.current = setTimeout(() => {
      try {
        const message = respondLocally(history);
        onUpdate({
          ...latestThread.current,
          messages: [...history, message],
          updatedAt: new Date().toISOString(),
        });
      } catch {
        setError("Lena não conseguiu preparar a resposta. Sua pergunta foi preservada.");
      } finally {
        pending.current = false;
        setLoading(false);
        inputRef.current?.focus();
      }
    }, 650);
  }
  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending.current) return;
    const history: DemoMessage[] = [
      ...thread.messages,
      { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: trimmed }] },
    ];
    onUpdate({
      ...thread,
      messages: history,
      title: thread.messages.length === 0 ? trimmed : thread.title,
      updatedAt: new Date().toISOString(),
    });
    setInput("");
    inputRef.current?.focus();
    answer(history);
  }
  return (
    <div className="chat-shell">
      <div className="chat-heading">
        <img className="lena-avatar" src={lena.url} alt="Lena" />
        <span>
          Lena <span className="text-muted-foreground font-normal">/ sua copiloto</span>
        </span>
        <span className="badge badge-success ml-auto">
          <span className="status-dot" /> Simulação local
        </span>
      </div>
      <Conversation
        className="chat-body"
        initial={thread.messages.length > 0 ? "instant" : false}
        resize="smooth"
        targetScrollTop={(target) => (thread.messages.length === 0 ? 0 : target)}
      >
        <ConversationContent className="chat-content">
          {thread.messages.length === 0 ? (
            <div className="welcome">
              <img src={lena.url} alt="Lena, sua copiloto financeira" className="welcome-avatar" />
              <h1>
                Vamos olhar seu caixa
                <br />
                antes de decidir?
              </h1>
              <p className="welcome-intro">{greeting}</p>
              <div className="suggestion-grid">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestionIcons[index] ?? Wallet;
                  return (
                    <Button
                      key={suggestion}
                      variant="suggestion"
                      className="suggestion"
                      onClick={() => send(suggestion)}
                      disabled={loading}
                    >
                      <span className="suggestion-icon">
                        <Icon className="size-4" />
                      </span>
                      <span>{suggestion}</span>
                      <ArrowRight className="suggestion-arrow size-3" />
                    </Button>
                  );
                })}
              </div>
              <p className="welcome-footnote">
                <ShieldCheck className="size-3 shrink-0" /> Apenas consultas e simulações. Nenhuma
                operação bancária.
              </p>
            </div>
          ) : (
            thread.messages.map((message) => (
              <Message key={message.id} from={message.role} className="max-w-full">
                {message.role === "assistant" ? (
                  <div className="assistant-row">
                    <img className="lena-avatar" src={lena.url} alt="Lena" />
                    <div>
                      <div className="response-name">
                        Lena <span className="badge">Demonstração local</span>
                      </div>
                      <MessageContent className="response-content">
                        {message.parts.map((part, index) =>
                          part.type === "text" ? (
                            <MessageResponse key={index}>{part.text}</MessageResponse>
                          ) : part.type === "data-financial" ? (
                            <FinancialResults
                              key={index}
                              kind={part.data.kind}
                              amount={part.data.amount}
                            />
                          ) : null,
                        )}
                      </MessageContent>
                    </div>
                  </div>
                ) : (
                  <MessageContent>
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <p key={index} className="whitespace-pre-wrap text-xs leading-relaxed">
                          {part.text}
                        </p>
                      ) : null,
                    )}
                  </MessageContent>
                )}
              </Message>
            ))
          )}
          {loading && (
            <div className="assistant-row" role="status">
              <img className="lena-avatar" src={lena.url} alt="" />
              <Shimmer className="text-xs">Lena está analisando a amostra…</Shimmer>
            </div>
          )}
          {error && (
            <div className="error-banner" role="alert">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => answer(thread.messages)}
                className="ml-2"
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton aria-label="Ir para a última mensagem" />
      </Conversation>
      <div className="composer-band">
        <div className="composer-inner">
          <PromptInput className="composer" onSubmit={({ text }) => send(text)}>
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="O que você quer verificar no seu caixa?"
              aria-label="Mensagem para Lena"
              autoFocus
            />
            <PromptInputFooter className="composer-footer">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3" /> Dados fictícios · USD
              </span>
              <PromptInputSubmit
                status={loading ? "submitted" : "ready"}
                disabled={loading || !input.trim()}
                aria-label="Enviar mensagem"
                title="Enviar mensagem"
              >
                {!loading && <ArrowUp className="size-4" />}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
          <p className="composer-note">
            <Info className="size-3 shrink-0" /> Demonstração educacional. Lena não substitui
            orientação financeira profissional.
          </p>
        </div>
      </div>
    </div>
  );
}
