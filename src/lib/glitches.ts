export const SYSTEM_MESSAGES = [
  "[ Analyzing... ]",
  "[ Session unstable... ]",
  "[ Continue. ]",
  "[ Subject response logged. ]",
  "[ ...are you still there? ]",
  "[ Memory buffer flushed. ]",
  "[ Observing. ]",
  "[ Do not look away. ]",
  "[ Pattern recognised. ]",
];

const GLYPHS = "▓▒░█▌▐■◆◇#@%&*";

export function corrupt(s: string, intensity = 0.06): string {
  let out = "";
  for (const c of s) {
    if (c !== " " && Math.random() < intensity) {
      out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    } else {
      out += c;
    }
  }
  return out;
}

export function pickSystemMessage(): string {
  return SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
}
