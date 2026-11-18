import { randomUUID } from "node:crypto";
import type { LessonChapter, LessonQuiz } from "@/types/lesson";

export const runtime = "nodejs";
export const maxDuration = 60;

const chapterSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "narration", "takeaway", "board"],
  properties: {
    title: { type: "string" },
    narration: { type: "string" },
    takeaway: { type: "string" },
    board: {
      type: "object",
      additionalProperties: false,
      required: ["title", "layout", "nodes", "edges"],
      properties: {
        title: { type: "string" },
        layout: { type: "string", enum: ["flow", "equation", "compare", "cycle", "timeline", "concept"] },
        nodes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "label", "detail", "x", "y", "shape"],
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              detail: { type: "string" },
              x: { type: "integer" },
              y: { type: "integer" },
              shape: { type: "string", enum: ["card", "circle"] },
            },
          },
        },
        edges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["from", "to", "label"],
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              label: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

const lessonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "hook", "objective", "chapters", "quiz"],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    objective: { type: "string" },
    chapters: { type: "array", items: chapterSchema },
    quiz: {
      type: "object",
      additionalProperties: false,
      required: ["question", "options", "answerIndex", "explanation"],
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        answerIndex: { type: "integer" },
        explanation: { type: "string" },
      },
    },
  },
} as const;

function errorMessage(status: number) {
  if (status === 401 || status === 403) return "The AI provider rejected the server API key. Check OPENAI_API_KEY in your deployment settings.";
  if (status === 429) return "The AI provider is busy or the project has reached its usage limit. Please try again shortly.";
  if (status >= 500) return "The AI provider is temporarily unavailable. Your topic is still here; please retry.";
  return "The lesson could not be generated. Please try a more specific topic.";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "AI lessons are not configured yet. Add OPENAI_API_KEY to the server environment." }, { status: 503 });

  let topic = "";
  try {
    const body = await request.json();
    topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 160) : "";
  } catch {
    return Response.json({ error: "Please enter a topic to learn." }, { status: 400 });
  }

  if (topic.length < 3) return Response.json({ error: "Add a little more detail so your tutor can choose a useful lesson." }, { status: 400 });

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(50_000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        store: false,
        max_output_tokens: 6000,
        instructions: [
          "You are a warm, precise visual tutor. Teach a curious secondary-school learner with no assumed specialist knowledge.",
          "Create a focused spoken lesson that takes about two minutes to narrate: aim for 240 to 280 spoken words across exactly 5 chapters, with about 45 to 55 words in each narration. Do not make the later chapters shorter. Explain one idea at a time, use a concrete analogy or worked example, and finish with a memorable takeaway.",
          "Return a genuinely topic-specific board scene for every chapter. Include at least 2 and usually 3 nodes in every scene; never return a one-node diagram. Coordinates are integers from 0 to 100; place nodes so labels do not overlap (use x 10..90, y 18..82). Edges must refer to existing node ids. Keep labels short and details concise.",
          "Choose the best layout: flow, equation, compare, cycle, timeline, or concept. Make the board explain the same idea being narrated at that moment.",
          "Include one concept-check multiple-choice question with exactly 4 choices and a single correct answer index from 0 to 3.",
        ].join(" "),
        input: `Teach this topic: ${topic}`,
        text: { format: { type: "json_schema", name: "whiteboard_lesson", strict: true, schema: lessonSchema } },
      }),
    });

    if (!upstream.ok) {
      const status = upstream.status;
      await upstream.body?.cancel();
      return Response.json({ error: errorMessage(status) }, { status: status === 429 ? 429 : status >= 500 ? 502 : 502 });
    }

    const payload = await upstream.json();
    const outputText = payload.output?.flatMap((item: { type?: string; content?: Array<{ type?: string; text?: string }> }) =>
      item.type === "message" ? item.content?.filter((content) => content.type === "output_text").map((content) => content.text ?? "") ?? [] : [],
    ).join("");
    if (!outputText) return Response.json({ error: "The tutor returned no lesson. Please try again." }, { status: 502 });

    const lesson = JSON.parse(outputText) as {
      title: string; hook: string; objective: string;
      chapters: Array<Omit<LessonChapter, "id">>;
      quiz: LessonQuiz;
    };
    if (!Array.isArray(lesson.chapters) || lesson.chapters.length < 3 || lesson.chapters.length > 7 || lesson.quiz.options.length !== 4 || lesson.quiz.answerIndex < 0 || lesson.quiz.answerIndex > 3) {
      return Response.json({ error: "The generated lesson was incomplete. Please generate it again." }, { status: 502 });
    }
    const narrationWords = lesson.chapters.reduce((total, chapter) => total + chapter.narration.trim().split(/\s+/).length, 0);
    if (narrationWords < 200) return Response.json({ error: "That lesson came back too short. Please retry once for the full explanation." }, { status: 502 });
    const chapterIds = new Set<string>();
    const chapters = lesson.chapters.map((chapter, index) => {
      const id = `chapter-${index + 1}`;
      chapterIds.add(id);
      const nodes = chapter.board.nodes.slice(0, 5).map((node, nodeIndex) => ({
        ...node,
        id: node.id.slice(0, 40) || `node-${nodeIndex}`,
        label: node.label.slice(0, 60),
        detail: node.detail.slice(0, 100),
        x: Math.max(12, Math.min(88, node.x)),
        y: Math.max(18, Math.min(82, node.y)),
      }));
      if (nodes.length === 0) nodes.push({ id: "core-idea", label: "Core idea", detail: chapter.takeaway.slice(0, 80), x: 50, y: 52, shape: "card" });
      if (nodes.length === 1) {
        const original = nodes[0];
        nodes.push({ id: "key-takeaway", label: "Remember", detail: chapter.takeaway.slice(0, 80), x: original.x < 50 ? 72 : 28, y: original.y, shape: "card" });
      }
      const ids = new Set(nodes.map((node) => node.id));
      const edges = chapter.board.edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to)).slice(0, 6);
      if (edges.length === 0 && nodes.length > 1) edges.push({ from: nodes[0].id, to: nodes[1].id, label: "leads to" });
      return {
        ...chapter,
        id,
        title: chapter.title.slice(0, 90),
        narration: chapter.narration.slice(0, 1800),
        takeaway: chapter.takeaway.slice(0, 180),
        board: {
          ...chapter.board,
          title: chapter.board.title.slice(0, 100),
          nodes,
          edges,
        },
      };
    });

    return Response.json({
      id: randomUUID(), topic, title: lesson.title.slice(0, 100), hook: lesson.hook.slice(0, 260),
      objective: lesson.objective.slice(0, 260), chapters, quiz: lesson.quiz,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "The tutor took too long to respond. Your topic is still here; please try again."
      : "The tutor could not build a structured lesson this time. Please retry.";
    return Response.json({ error: message }, { status: 502 });
  }
}
