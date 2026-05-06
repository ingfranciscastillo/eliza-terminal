# Eliza Terminal

[![live_preview](https://img.shields.io/badge/live_preview-000?style=for-the-badge&logo=vercel&logoColor=white)](https://eliza-terminal.vercel.app)
[![behance](https://img.shields.io/badge/behance-1769FF?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/ingfranciscastillo)

Una implementación moderna del legendario chatbot ELIZA con una interfaz de terminal estilo CRT de los años 80.

![Screenshot Placeholder](https://placehold.co/800x400/000000/00FF00?text=Eliza+Terminal+Screenshot)

---

## Quick Start

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## La Historia de ELIZA

### El Origen

En 1966, en el MIT (Massachusetts Institute of Technology), el científico alemán **Joseph Weizenbaum** creó **ELIZA** - uno de los primeros programas de la historia capaz de mantener una conversación en lenguaje natural. El programa simulaba ser un psicoterapeuta Rogeriano llamado "DOCTOR".

Weizenbaum publicó su paper [_ELIZA - A Computer Program For the Study of Natural Language Communication Between Man and Machine_](https://dl.acm.org/doi/10.1145/365153.365168) en 1966, describiendo un sistema que podía:

- Recebir entrada en lenguaje natural
- Aplicar transformaciones mediante reglas de pattern matching
- Generar respuestas que simularan empatía
- Mantener el rol de "psicoterapeuta no directivo"

### La Técnica

ELIZA utilizaba una técnica de **transformación de oraciones** basada en:

1. **Pattern Matching**: Cada palabra clave en la entrada del usuario activa una regla específica
2. **Descomposición**: La oración se parte en componentes
3. **Reensamblaje**: Los componentes se recombinan usando plantillas predefinidas
4. **Intercambio de pronombres**: "I" → "you", "my" → "your", etc.

Por ejemplo, si el usuario dice:

> "I am feeling sad because my cat died"

ELIZA podría responder:

> "Tell me more about your feelings. You say you are sad because your cat died. How long have you been sad?"

La clave del efecto "inteligente" era que el programa:
- Usaba la palabra clave de mayor jerarquía
- Extraía la porción relevante de la oración del usuario
- Devolvía una pregunta o comentario que incluía esas palabras

### El Impacto Inesperado

Lo que sorprendió a Weizenbaum fue la **reacción emocional** de los usuarios. Mucha gente comenzaba a treated al programa como si fuera un verdadero terapeuta, algunos incluso revelaban problemas personales profundos.

En su libro de 1976, _Computer Power and Human Reason_, Weizenbaum escribió:

> "What I had not realized is that the shortest distance between a man and his computer is the conversation between them... I had not realized... how powerfully the computer's verbal facility could be used to induce *involvement* in the conversation."

Weizenbaum quedó tan perturbado por este fenómeno que eventualmente se convirtió en uno de los críticos más vocales de la inteligencia artificial, arguing que las máquinas nunca deberían tomar decisiones que afecten la vida de las personas.

### Legado

ELIZA sentó las bases para:
- **Chatbots modernos** - Desde Siri hasta ChatGPT
- **NLP temprana** - Procesamiento de lenguaje natural
- **Pruebas de Turing** - El concepto de conversación como test de inteligencia
- **Diseño de interfaces conversacionales** - Voice UIs, chatbots de servicio

---

## Sobre Este Proyecto

Este proyecto es un **homenaje técnico y artístico** a ELIZA, reimaginado para la web moderna con:

- **Estética retro** - Displays CRT, efecto fósforo verde, scanlines
- **Efectos dinámicos** - Glitches, parpadeos, delay typewriter
- **Persistencia** - Sesiones guardadas en localStorage
- **Comportamiento emergente** - "Drift" después de conversaciones largas

No es una replicas exacta del código original de Weizenbaum (escrito en MAD-SLIP para el mainframe IBM 7094), sino una reinterpretación moderna del concepto.

---

## Arquitectura

### Stack Técnico

```
React 19 + TanStack Start
├── TanStack Router (file-based routing)
├── TanStack Start (SSR + API routes)
├── Tailwind CSS v4
│   └── Custom theme: terminal palette
├── TypeScript
└── Vitest (testing)
```

### Estructura del Proyecto

```
src/
├── components/
│   ├── Terminal.tsx    # Componente principal
│   └── Message.tsx     # Render de mensajes con typewriter
├── lib/
│   ├── eliza.ts        # Motor de ELIZA (rules + responses)
│   └── glitches.ts     # Efectos visuales + mensajes del sistema
├── routes/
│   ├── __root.tsx      # Root layout
│   └── index.tsx       # Home -> Terminal
└── styles.css          # CRT effects + theme
```

### Cómo Funciona el Motor ELIZA

1. **Preprocesamiento**: Normalización del texto (lowercase, remove punctuation, synonym mapping)

2. **Matching de Reglas**:
   - Busca palabras clave en orden de prioridad (rank)
   - Aplica regex de descomposición
   - Selecciona plantilla de respuesta (rotación)

3. **Transformación**:
   - Intercambia pronombres (I↔you, my↔your)
   - Reemplaza `*` con la porción capturada del input
   - Guarda fragmentos significativos en memoria

4. **Respuesta**:
   - Si hay match: retorna respuesta transformada
   - Si no: fallback ("Please go on.")
   - Memory resurfacing: ocasionalmente menciona topics previos

---

## Features

- ✅ Efecto typewriter con delay variable
- ✅ Glitch visual aleatorio que se autocorige
- ✅ Persistencia de sesión (localStorage)
- ✅ Comando `/reset` para reiniciar
- ✅ Mensajes del sistema cada 4 intercambios
- ✅ "Drift" behavior después de 12+ intercambios
- ✅ Scanlines CRT overlay
- ✅ Efecto viñeta
- ✅ Cursor parpadeante
- ✅ Text glow (efecto fósforo)
- ✅ Soporte para contracciones (I'm, don't, etc.)
- ✅ Manejo de palabras ocultas (exit, help, who are you)

---

## Keyboard Shortcuts

| Comando | Descripción |
|---------|-------------|
| `/reset` | Reinicia la sesión y borra el historial |
| `Enter` | Envía el mensaje |
| `Click` | Focus en el input |

---

## Deployment

```bash
# Build para producción
pnpm build

# Run del servidor
node dist/server/index.mjs
```

Deploy a Vercel, Netlify, Render, o cualquier host que soporte Node.js.

---

## Inspiración

- Joseph Weizenbaum, "ELIZA - A Computer Program For the Study of Natural Language Communication Between Man and Machine" (1966)
- Joseph Weizenbaum, _Computer Power and Human Reason_ (1976)
- Stanford AI Lab archives
- Retro computing aesthetics