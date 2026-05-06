import { useCallback, useEffect, useRef, useState } from "react";
import { Eliza } from "@/lib/eliza";
import { pickSystemMessage } from "@/lib/glitches";
import { Message, type MessageData } from "./Message";

const STORAGE_KEY = "eliza.session.v1";

const BANNER = `        EEEEEE  LL        IIII   ZZZZZZZ   AAAAA
        EE      LL         II         ZZ   AA    AA
        EEEE    LL         II       ZZZ    AAAAAAAA
        EE      LL         II      ZZ      AA    AA
        EEEEEE  LLLLLL    IIII   ZZZZZZZ   AA    AA`;

const INTRO_LINES = [
  "Welcome to",
  BANNER,
  "",
  "Eliza is a mock Rogerian psychotherapist.",
  "The original program was described by Joseph Weizenbaum in 1966.",
  "",
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function Terminal() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const elizaRef = useRef(new Eliza());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const exchangeCount = useRef(0);

  // Boot or restore
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MessageData[];
        setMessages([
          ...parsed.map((m) => ({ ...m, instant: true })),
          { id: uid(), kind: "system", text: "[ Session resumed. ]" },
        ]);
        setBusy(false);
        return;
      } catch { /* fall through to boot */ }
    }
    runBoot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runBoot = useCallback(async () => {
    setBusy(true);
    const queue: MessageData[] = INTRO_LINES.map((t) => ({
      id: uid(), kind: "banner", text: t,
    }));
    queue.push({ id: uid(), kind: "eliza", text: "Is something troubling you ?" });

    for (const m of queue) {
      await new Promise<void>((resolve) => {
        setMessages((prev) => [...prev, { ...m, _resolve: resolve } as MessageData & { _resolve: () => void }]);
      });
    }
    setBusy(false);
  }, []);

  // Persist (skip while booting)
  useEffect(() => {
    if (busy) return;
    const persistable = messages.filter((m) => m.kind !== "system" || !m.text.includes("Session resumed"));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable.map(({ id, kind, text }) => ({ id, kind, text }))));
    } catch { /* ignore */ }
  }, [messages, busy]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  // Random flicker
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 18000 + Math.random() * 35000;
      t = setTimeout(() => {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 90 + Math.random() * 120);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // Random "are you still there" idle nudge
  useEffect(() => {
    if (busy) return;
    const t = setTimeout(() => {
      if (input.length === 0) {
        appendSystem();
      }
    }, 45000 + Math.random() * 30000);
    return () => clearTimeout(t);
  }, [messages, busy, input]);

  const appendSystem = useCallback(() => {
    setMessages((prev) => [...prev, { id: uid(), kind: "system", text: pickSystemMessage() }]);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (text === "/reset") {
      window.localStorage.removeItem(STORAGE_KEY);
      elizaRef.current.reset();
      setMessages([]);
      runBoot();
      return;
    }

    setMessages((prev) => [...prev, { id: uid(), kind: "user", text, instant: true }]);
    setBusy(true);

    exchangeCount.current += 1;
    const insertSystem = exchangeCount.current % 4 === 0 && Math.random() < 0.7;

    const delay = 700 + Math.random() * 1200;
    setTimeout(() => {
      if (insertSystem) {
        setMessages((prev) => [...prev, { id: uid(), kind: "system", text: pickSystemMessage() }]);
      }
      const reply = elizaRef.current.respond(text);
      const id = uid();
      setMessages((prev) => [...prev, {
        id, kind: "eliza", text: reply,
        // when typewriter completes, free the input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _resolve: () => setBusy(false),
      } as any]);
    }, delay);
  }, [input, busy, runBoot]);

  // Resolve queued messages when their typewriter finishes
  const handleDone = useCallback((id: string) => {
    setMessages((prev) => {
      const m = prev.find((x) => x.id === id) as (MessageData & { _resolve?: () => void }) | undefined;
      m?._resolve?.();
      if (m) m._resolve = undefined;
      return prev;
    });
  }, []);

  return (
    <main
      className={`relative h-screen w-screen overflow-hidden bg-terminal-bg font-mono text-[15px] leading-normal text-terminal ${flicker ? "opacity-70" : "opacity-100"} transition-opacity duration-75`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* scanlines */}
      <div className="pointer-events-none absolute inset-0 z-10 scanlines" />
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 vignette" />

      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto px-6 pt-6 pb-20"
      >
        {messages.map((m) => (
          <Message key={m.id} message={m} onDone={() => handleDone(m.id)} />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-0 bg-terminal-bg px-6 py-3 border-t border-terminal/20"
      >
        <span className="text-terminal">YOU:&nbsp;&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-terminal caret-transparent outline-none disabled:opacity-50"
          aria-label="terminal input"
        />
        <span className="terminal-cursor" aria-hidden />
      </form>
    </main>
  );
}
