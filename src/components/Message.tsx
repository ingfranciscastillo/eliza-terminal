import { useEffect, useState } from "react";
import { corrupt } from "@/lib/glitches";

export type MessageKind = "user" | "eliza" | "system" | "banner";

export interface MessageData {
  id: string;
  kind: MessageKind;
  text: string;
  // If true, render instantly (e.g. restored from history)
  instant?: boolean;
}

interface Props {
  message: MessageData;
  onDone?: () => void;
}

const SPEED: Record<MessageKind, number> = {
  user: 0,
  eliza: 28,
  system: 18,
  banner: 4,
};

export function Message({ message, onDone }: Props) {
  const [shown, setShown] = useState(message.instant ? message.text : "");
  const speed = SPEED[message.kind];

  useEffect(() => {
    if (message.instant || speed === 0) {
      setShown(message.text);
      onDone?.();
      return;
    }
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      if (message.kind === "eliza" && Math.random() < 0.06) {
        setTimeout(tick, 200 + Math.random() * 600);
        return;
        }
      if (i >= message.text.length) {
        setShown(message.text);
        setTimeout(() => onDone?.(), 200 + Math.random() * 400);
        return;
        }
      // occasional glyph corruption that "self-corrects"
      const slice = message.text.slice(0, i);

      const glitchChance =
        message.kind === "eliza"
            ? Math.min(0.12, 0.02 + message.text.length / 200)
            : 0;

      if (message.kind === "eliza" && glitchChance) {
        setShown(corrupt(slice, 0.08));
        setTimeout(() => {
          if (!cancelled) setShown(message.text.slice(0, i));
        }, 60);
      } else {
        setShown(slice);
      }

      const jitter = speed * (0.6 + Math.random() * 1.8);
      setTimeout(tick, jitter);
    };
    
    const thinkingDelay =
    message.kind === "eliza"
        ? 400 + Math.random() * 1200
        : speed;

    const t = setTimeout(tick, thinkingDelay);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prefix =
    message.kind === "user" ? "YOU:   " :
    message.kind === "eliza" ? "ELIZA: " :
    "";

  const cls =
    message.kind === "system" ? "text-terminal-dim italic" :
    message.kind === "banner" ? "text-terminal whitespace-pre" :
    "text-terminal";

  return (
    <div className={cls}>
      {prefix}{shown}
    {!message.instant && message.kind !== "user" && (
    <span className="animate-pulse">█</span>
    )}
    </div>
  );
}
