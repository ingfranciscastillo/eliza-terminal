![Logo](/public/og-image.jpg)

# Eliza Terminal

[![live_preview](https://img.shields.io/badge/live_preview-000?style=for-the-badge&logo=vercel&logoColor=white)](https://eliza-terminal.vercel.app)
[![behance](https://img.shields.io/badge/behance-1769FF?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/ingfranciscastillo)
[![github_stars](https://img.shields.io/github/stars/ingfranciscastillo/ai-resume-analyzer?style=for-the-badge)](https://github.com/ingfranciscastillo/eliza-terminal/stargazers)
[![license](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![linkedin](https://img.shields.io/badge/linkedin-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ingfranciscastillo)
[![last_commit](https://img.shields.io/github/last-commit/ingfranciscastillo/ai-resume-analyzer?style=for-the-badge)](https://github.com/ingfranciscastillo/eliza-terminal/commits/main)

<!-- README-I18N:START -->

**English** | [Español](./README.es.md)

<!-- README-I18N:END -->

A modern implementation of the legendary ELIZA chatbot with a CRT terminal interface from the 80s.

![Screenshot Placeholder](/screenshot.png)

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## The History of ELIZA

### Origins

In 1966, at MIT (Massachusetts Institute of Technology), German scientist **Joseph Weizenbaum** created **ELIZA** - one of the first programs in history capable of maintaining natural language conversation. The program simulated being a Rogerian psychotherapist called "DOCTOR".

Weizenbaum published his paper [_ELIZA - A Computer Program For the Study of Natural Language Communication Between Man and Machine_](https://dl.acm.org/doi/10.1145/365153.365168) in 1966, describing a system that could:

- Receive natural language input
- Apply transformations through pattern matching rules
- Generate responses that simulated empathy
- Maintain the role of a "non-directive psychotherapist"

### The Technique

ELIZA used a **sentence transformation** technique based on:

1. **Pattern Matching**: Each keyword in the user's input triggers a specific rule
2. **Decomposition**: The sentence is split into components
3. **Reassembly**: Components are recombined using predefined templates
4. **Pronoun Swapping**: "I" → "you", "my" → "your", etc.

For example, if the user says:

> "I am feeling sad because my cat died"

ELIZA might respond:

> "Tell me more about your feelings. You say you are sad because your cat died. How long have you been sad?"

The key to the "intelligent" effect was that the program:

- Used the highest-ranking keyword
- Extracted the relevant portion of the user's sentence
- Returned a question or comment that included those words

### The Unexpected Impact

What surprised Weizenbaum was the **emotional reaction** from users. Many people began to treat the program as if it were a real therapist, some even revealing deep personal problems.

In his 1976 book, _Computer Power and Human Reason_, Weizenbaum wrote:

> "What I had not realized is that the shortest distance between a man and his computer is the conversation between them... I had not realized... how powerfully the computer's verbal facility could be used to induce _involvement_ in the conversation."

Weizenbaum was so disturbed by this phenomenon that he eventually became one of the most vocal critics of artificial intelligence, arguing that machines should never make decisions that affect people's lives.

### Legacy

ELIZA laid the groundwork for:

- **Modern Chatbots** - From Siri to ChatGPT
- **Early NLP** - Natural Language Processing
- **Turing Tests** - The concept of conversation as a test of intelligence
- **Conversational Interface Design** - Voice UIs, service chatbots

---

## About This Project

This project is a **technical and artistic tribute** to ELIZA, reimagined for the modern web with:

- **Retro aesthetic** - CRT displays, green phosphor effect, scanlines
- **Dynamic effects** - Glitches, flickering, typewriter delay
- **Persistence** - Sessions saved in localStorage
- **Emergent behavior** - "Drift" after long conversations

It is not an exact replica of Weizenbaum's original code (written in MAD-SLIP for the IBM 7094 mainframe), but a modern reinterpretation of the concept.

---

## Architecture

### Tech Stack

```
React 19 + TanStack Start
├── TanStack Router (file-based routing)
├── TanStack Start (SSR + API routes)
├── Tailwind CSS v4
│   └── Custom theme: terminal palette
├── TypeScript
└── Vitest (testing)
```

### Project Structure

```
src/
├── components/
│   ├── Terminal.tsx    # Main component
│   └── Message.tsx     # Message render with typewriter
├── lib/
│   ├── eliza.ts        # ELIZA engine (rules + responses)
│   └── glitches.ts     # Visual effects + system messages
├── routes/
│   ├── __root.tsx      # Root layout
│   └── index.tsx       # Home -> Terminal
└── styles.css          # CRT effects + theme
```

### How the ELIZA Engine Works

1. **Preprocessing**: Text normalization (lowercase, remove punctuation, synonym mapping)

2. **Rule Matching**:
   - Search for keywords in priority order (rank)
   - Apply decomposition regex
   - Select response template (rotation)

3. **Transformation**:
   - Swap pronouns (I↔you, my↔your)
   - Replace `*` with the captured portion of input
   - Save meaningful fragments to memory

4. **Response**:
   - If match: return transformed response
   - If no match: fallback ("Please go on.")
   - Memory resurfacing: occasionally mentions previous topics

---

## Features

- ✅ Typewriter effect with variable delay
- ✅ Random visual glitch that self-corrects
- ✅ Session persistence (localStorage)
- ✅ `/reset` command to restart
- ✅ System messages every 4 exchanges
- ✅ "Drift" behavior after 12+ exchanges
- ✅ CRT scanlines overlay
- ✅ Vignette effect
- ✅ Blinking cursor
- ✅ Text glow (phosphor effect)
- ✅ Contraction support (I'm, don't, etc.)
- ✅ Hidden word handling (exit, help, who are you)

---

## Keyboard Shortcuts

| Command  | Description                       |
| -------- | --------------------------------- |
| `/reset` | Resets the session and clears history |
| `Enter`  | Send message                      |
| `Click`  | Focus on input                    |

---

## Inspiration

- Joseph Weizenbaum, "ELIZA - A Computer Program For the Study of Natural Language Communication Between Man and Machine" (1966)
- Joseph Weizenbaum, _Computer Power and Human Reason_ (1976)
- Stanford AI Lab archives
- Retro computing aesthetics