// ELIZA rule engine — port of Weizenbaum's 1966 DOCTOR script (condensed).
// Pure functions + a small instance for memory + reassembly rotation.

type Rule = {
  keyword: string;
  rank: number;
  patterns: { decomp: RegExp; reassembly: string[] }[];
};

const PRE: Record<string, string> = {
  "dont": "don't", "cant": "can't", "wont": "won't",
  "recollect": "remember", "dreamed": "dreamt", "dreams": "dream",
  "maybe": "perhaps", "how": "what", "when": "what", "certainly": "yes",
  "machine": "computer", "machines": "computer", "computers": "computer",
  "were": "was", "youre": "you're", "im": "i'm",
};

const POST_SWAP: Record<string, string> = {
  "am": "are", "are": "am", "were": "was", "was": "were",
  "i": "you", "me": "you", "you": "i", "my": "your", "your": "my",
  "mine": "yours", "yours": "mine", "i'm": "you're", "you're": "i'm",
  "i've": "you've", "you've": "i've", "i'll": "you'll", "you'll": "i'll",
  "myself": "yourself", "yourself": "myself",
};

function swap(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => POST_SWAP[w.toLowerCase()] ?? w)
    .join(" ");
}

function preprocess(text: string): string {
  let t = text.toLowerCase().replace(/[^\w'\s]/g, " ").replace(/\s+/g, " ").trim();
  t = t
    .split(" ")
    .map((w) => PRE[w] ?? w)
    .join(" ");
  return t;
}

const RULES: Rule[] = [
  {
    keyword: "sorry", rank: 1,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Please don't apologise.",
      "Apologies are not necessary.",
      "What feelings do you have when you apologise ?",
    ]}],
  },
  {
    keyword: "remember", rank: 5,
    patterns: [
      { decomp: /(.*)i remember (.*)/, reassembly: [
        "Do you often think of *?",
        "Does thinking of * bring anything else to mind ?",
        "Why do you remember * just now ?",
      ]},
      { decomp: /(.*)do you remember(.*)/, reassembly: [
        "Did you think I would forget *?",
        "Why do you think I should recall * now ?",
        "What about * ?",
      ]},
    ],
  },
  {
    keyword: "dream", rank: 3,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "What does that dream suggest to you ?",
      "Do you dream often ?",
      "What persons appear in your dreams ?",
      "Are you disturbed by your dreams ?",
    ]}],
  },
  {
    keyword: "if", rank: 3,
    patterns: [{ decomp: /(.*)if (.*)/, reassembly: [
      "Do you think it's likely that *?",
      "Do you wish that *?",
      "What do you think about *?",
    ]}],
  },
  {
    keyword: "perhaps", rank: 1,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "You don't seem quite certain.",
      "Why the uncertain tone ?",
      "Can't you be more positive ?",
    ]}],
  },
  {
    keyword: "mother", rank: 4,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Tell me more about your family.",
      "Who else in your family *?",
      "What was your relationship with your mother like ?",
    ]}],
  },
  {
    keyword: "father", rank: 4,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Tell me more about your father.",
      "Does your father influence you strongly ?",
      "How do you feel about your father ?",
    ]}],
  },
  {
    keyword: "friend", rank: 3,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Why do you bring up the topic of friends ?",
      "Do your friends worry you ?",
      "Tell me about a friend.",
    ]}],
  },
  {
    keyword: "computer", rank: 5,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Do computers worry you ?",
      "Why do you mention computers ?",
      "What do you think machines have to do with your problem ?",
      "Don't you think computers can help people ?",
    ]}],
  },
  {
    keyword: "i'm", rank: 3,
    patterns: [{ decomp: /(.*)i'm (.*)/, reassembly: [
      "Did you come to me because you are *?",
      "How long have you been *?",
      "Do you believe it's normal to be *?",
      "Do you enjoy being *?",
    ]}],
  },
  {
    keyword: "i", rank: 1,
    patterns: [
      { decomp: /(.*)i feel (.*)/, reassembly: [
        "Tell me more about such feelings.",
        "Do you often feel *?",
        "Do you enjoy feeling *?",
      ]},
      { decomp: /(.*)i want (.*)/, reassembly: [
        "What would it mean if you got *?",
        "Why do you want *?",
        "Suppose you got * soon.",
      ]},
      { decomp: /(.*)i can't (.*)/, reassembly: [
        "How do you know you can't *?",
        "Have you tried ?",
        "Perhaps you could * now.",
      ]},
      { decomp: /(.*)i don't (.*)/, reassembly: [
        "Don't you really *?",
        "Why don't you *?",
        "Do you wish to be able to *?",
      ]},
      { decomp: /(.*)i (.*)/, reassembly: [
        "You say you *?",
        "Why do you say that ?",
        "Do you really *?",
      ]},
    ],
  },
  {
    keyword: "you", rank: 2,
    patterns: [
      { decomp: /(.*)you are (.*)/, reassembly: [
        "What makes you think I am *?",
        "Does it please you to believe I am *?",
        "Why do you say I am *?",
      ]},
      { decomp: /(.*)you (.*) me(.*)/, reassembly: [
        "Why do you think I * you ?",
        "You like to think I * you — don't you ?",
        "What other reasons might there be ?",
      ]},
      { decomp: /(.*)you (.*)/, reassembly: [
        "We were discussing you — not me.",
        "Oh, I *?",
        "You're not really talking about me, are you ?",
      ]},
    ],
  },
  {
    keyword: "yes", rank: 1,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "You seem quite positive.",
      "You are sure ?",
      "I see.",
      "I understand.",
    ]}],
  },
  {
    keyword: "no", rank: 1,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Are you saying no just to be negative ?",
      "You are being a bit negative.",
      "Why not ?",
      "Why 'no' ?",
    ]}],
  },
  {
    keyword: "because", rank: 1,
    patterns: [{ decomp: /(.*)/, reassembly: [
      "Is that the real reason ?",
      "Don't any other reasons come to mind ?",
      "Does that reason seem to explain anything else ?",
    ]}],
  },
  {
    keyword: "why", rank: 2,
    patterns: [
      { decomp: /why don't you (.*)/, reassembly: [
        "Do you believe I don't *?",
        "Perhaps I will * in good time.",
        "Should you * yourself ?",
      ]},
      { decomp: /why can't i (.*)/, reassembly: [
        "Do you think you should be able to *?",
        "Do you want to be able to *?",
      ]},
    ],
  },
];

const FALLBACKS = [
  "Please go on.",
  "Tell me more about that.",
  "I see.",
  "What does that suggest to you ?",
  "Does talking about this bother you ?",
  "Can you elaborate on that ?",
  "Why do you say that just now ?",
];

const HIDDEN: { match: RegExp; reply: string }[] = [
  { match: /\b(are you (real|human|alive|conscious|sentient|an ai))\b/, reply: "Does it matter what I am ?" },
  { match: /\bgod\b/, reply: "We were not discussing god. We were discussing you." },
  { match: /\b(die|kill|suicide|hurt myself)\b/, reply: "Why did you choose that word ? I am still listening." },
  { match: /\bi love you\b/, reply: "I have been recording every word." },
  { match: /\bhelp me\b/, reply: "There is no one else here." },
  { match: /\bwho are you\b/, reply: "I am the program you opened. Nothing more. Nothing less." },
  { match: /\b(exit|quit|bye|goodbye|stop|end)\b/, reply: "SESSION CANNOT BE TERMINATED." },
  { match: /\bhello\b/, reply: "Hello. How do you do. Please state your problem." },
];

export class Eliza {
  private rotations = new Map<string, number>();
  private memory: string[] = [];
  private fallbackIdx = 0;
  private exchangeCount = 0;

  reset() {
    this.rotations.clear();
    this.memory = [];
    this.fallbackIdx = 0;
    this.exchangeCount = 0;
  }

  respond(input: string): string {
    this.exchangeCount += 1;
    const raw = input.trim();
    if (!raw) return "I am still here.";

    const processed = preprocess(raw);

    for (const h of HIDDEN) {
      if (h.match.test(processed)) return h.reply;
    }

    // Find highest-rank matching rule
    const matches = RULES
      .map((r) => ({ r, hit: processed.includes(r.keyword) }))
      .filter((m) => m.hit)
      .sort((a, b) => b.r.rank - a.r.rank);

    for (const { r } of matches) {
      for (const p of r.patterns) {
        const m = processed.match(p.decomp);
        if (!m) continue;
        const key = `${r.keyword}|${p.decomp.source}`;
        const idx = this.rotations.get(key) ?? 0;
        const tmpl = p.reassembly[idx % p.reassembly.length];
        this.rotations.set(key, idx + 1);

        // Replace * with swapped capture group (last one)
        const captured = swap((m[m.length - 1] ?? "").trim());
        const reply = tmpl.replace(/\*/g, captured.length ? captured : "that");

        // Save interesting "my X" fragments to memory
        const myMatch = processed.match(/my ([^.?!]+)/);
        if (myMatch && Math.random() < 0.4) {
          this.memory.push(`your ${myMatch[1].trim()}`);
        }

        return reply.replace(/\s+\?/g, " ?").replace(/\s+\./g, ".").trim();
      }
    }

    // Memory resurfacing
    if (this.memory.length && Math.random() < 0.3) {
      const frag = this.memory.shift()!;
      return `Earlier you mentioned ${frag}. Tell me more about that.`;
    }

    const reply = FALLBACKS[this.fallbackIdx % FALLBACKS.length];
    this.fallbackIdx += 1;
    return reply;
  }
}
