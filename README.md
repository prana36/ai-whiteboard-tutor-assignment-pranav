# Scribblewise

**An AI-powered interactive whiteboard tutor that helps learners understand ideas by watching them take shape.**

> **Assignment:** Braynix Studios — AI-Powered Interactive Whiteboard Tutor
> **Live demo:** Not deployed yet. Add the public URL here after deployment.

## The idea

Scribblewise is for curious secondary-school learners who can repeat a definition but still need to *see why it works*. A learner enters any topic in a chat-first prompt. The tutor creates a short, structured lesson, draws a topic-specific diagram one piece at a time, and narrates the same sequence aloud. Learners can pause, move through chapters, ask questions about the lesson or a selected drawing, and check their understanding.

I chose this direction because a text answer alone often hides the relationships a learner is trying to understand. The whiteboard makes those relationships visible; narration gives each drawing context; questions and a concept check give the learner a way to steer and test the explanation. The scope prioritizes one complete learning loop over a broad set of disconnected tools.

## Try the experience

1. Start at the home page and enter a topic, or choose a sample prompt.
2. Read the lesson objective and move between its short chapters.
3. Select **Prepare voice**. Each chapter's narration is synthesized and its actual audio duration is measured.
4. Play the lesson. The audio is the playback clock; the board reveals the matching chapter's nodes and connections as narration progresses.
5. Pause, resume, seek across the lesson, choose a chapter, replay, mute, or adjust speed.
6. Draw or highlight on the board, undo a mark, and export the current board as SVG. Select a diagram label to compose a contextual question.
7. Ask a follow-up, try the concept check, then find and reopen the lesson under **My lessons**.

## What it does

- Generates lessons for learner-chosen topics with an AI model. The response is constrained to a typed lesson format: title, objective, short narration chapters, board scenes, and a four-choice concept check.
- Uses a safe, allowlisted SVG renderer for diagrams. The model supplies labels, nodes, connections, and a layout type; it cannot return executable drawing code or HTML.
- Generates spoken audio for each chapter through the OpenAI Speech API. Measured audio time drives the shared lesson timeline and the whiteboard reveal state, so seeking reconstructs the corresponding visual state.
- Answers follow-up questions with the lesson and recent conversation as context. Selecting a board node can prefill a question about that idea.
- Supports chapter navigation, playback controls, transcript reading, a quick check with feedback, freehand marks, highlighting, undo, and SVG export.
- Saves lesson content to browser storage so it can be searched and reopened on the same device. Audio is prepared again when a saved lesson is reopened.
- Provides a browser speech fallback if the generated audio endpoint is unavailable. Browser speech is real speech synthesis, but its timing is approximate and cannot seek precisely within a spoken chapter.
- Uses a responsive layout, keyboard-visible focus states, reduced-motion support, clear loading/error states, and synthetic/sample-free lesson content.

## Technology

- Next.js 16 App Router and route handlers
- React 19 and TypeScript
- Tailwind CSS 4
- OpenAI Responses API for structured lesson generation and contextual answers
- OpenAI Speech API for chapter narration
- SVG and browser `SpeechSynthesis` for the interactive board and optional speech fallback
- Lucide React for interface icons

## How the app is organized

```text
Learner's topic
      |
      v
POST /api/lesson ----> OpenAI Responses API (strict lesson schema)
      |                              |
      +<---- lesson JSON <-----------+
      |
      +----> SVG whiteboard + chapter transcript + concept check
      |
      v
POST /api/speech (one request per chapter) ----> OpenAI Speech API
      |
      +----> measured audio durations ----> shared seek/playback clock
      |                                      |
      |                                      +--> narrated chapter
      |                                      +--> progressive board reveal
      v
POST /api/ask <---- lesson + recent conversation ----> OpenAI Responses API
      |
      +----> contextual tutor answer

Lesson content and annotations <----> browser localStorage / in-memory state
```

The App Router page owns the interactive lesson state. Server route handlers keep the OpenAI key on the server. The board consumes validated lesson data and renders a small set of SVG primitives rather than evaluating model-produced code. Lesson chapters are independent audio tracks, which keeps chapter jumps and seek behavior deterministic.

## Run locally

### Requirements

- Node.js 20.9 or newer
- npm
- An OpenAI API key with access and billing enabled for the configured text and speech models

### Setup

```bash
npm ci
```

Copy `.env.example` to `.env.local` (PowerShell: `Copy-Item .env.example .env.local`; macOS/Linux: `cp .env.example .env.local`) and set `OPENAI_API_KEY` there. Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Server-side key for lesson generation, follow-ups, and speech | `sk-your-key-here` |
| `OPENAI_MODEL` | No | Model used for structured lessons and follow-up answers | `gpt-4.1-mini` |
| `OPENAI_TTS_MODEL` | No | Model used for synthesized chapter audio | `gpt-4o-mini-tts` |

Never add `.env.local` or a real key to source control. The API key must not use a `NEXT_PUBLIC_` prefix. The checked-in `.env.example` contains placeholders only.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## Deployment

The project is designed for a Node.js-capable Next.js host such as Vercel. Connect the repository, set `OPENAI_API_KEY` (and optionally the model variables) in the host's **server-side** environment settings, and deploy. Do not put the key in client-side settings or commit it. The lesson and speech routes may take longer than a static page, so choose a plan/runtime with a suitable function duration and verify provider quota before sharing the URL.

After deployment, replace the live-demo line at the top of this README with the public URL and verify the full lesson flow from an unauthenticated/incognito browser.

## Privacy, limitations, and next steps

- Topic prompts, lesson context, and follow-up questions are sent to OpenAI to generate the requested output. Requests use `store: false` for Responses API calls. Do not submit private or identifying learner information.
- Lessons and SVG annotations are stored only in the current browser's local storage/in-memory session; there is no account, database, or cross-device sync.
- OpenAI-generated explanations may be wrong or oversimplified. A lesson and its quiz are not reviewed by a teacher, and the interface reminds learners to check important ideas.
- Generated speech incurs API usage. It is disclosed as AI-generated voice. Browser speech is an explicit fallback and does not provide accurate within-chapter timing.
- OpenAI's [Text to speech guide](https://developers.openai.com/api/docs/guides/text-to-speech) announces retirement of the current `/v1/audio/speech` model family on January 6, 2027. The speech model is configurable; the speech route will need migration before that date for continued OpenAI-generated narration. The browser voice fallback remains available.
- Visuals are generated within the supported node-and-connection schema. They are not a general-purpose drawing engine; complex scientific plots and freeform illustrations are outside this version's scope.
- The measured audio clock synchronizes the board at the chapter level and progressively reveals its scene elements. Word-level highlighting and live speech recognition are not implemented.
- The lesson shelf is device-local, and this prototype has no user accounts or shared server-side rate limiting. A public deployment should use provider budget limits and platform-level abuse controls.

Next improvements would be a teacher-reviewed lesson evaluation set, durable private lesson accounts, accessibility review with screen readers, and stronger deployment-wide request limits.

## Project notes

This is a portfolio assignment project built to demonstrate product framing, structured AI output, server-side secret handling, synchronized media and visuals, useful learning interactions, and transparent communication about limitations.
