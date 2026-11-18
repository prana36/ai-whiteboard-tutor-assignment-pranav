export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "Follow-up AI is not configured. Add OPENAI_API_KEY to the server environment." }, { status: 503 });
  try {
    const body = await request.json();
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 600) : "";
    const title = typeof body.title === "string" ? body.title.slice(0, 120) : "";
    const objective = typeof body.objective === "string" ? body.objective.slice(0, 300) : "";
    const chapters = Array.isArray(body.chapters) ? body.chapters.slice(0, 7).map((chapter: { title?: string; narration?: string; takeaway?: string }) => ({
      title: String(chapter.title ?? "").slice(0, 90), narration: String(chapter.narration ?? "").slice(0, 1800), takeaway: String(chapter.takeaway ?? "").slice(0, 180),
    })) : [];
    const history = Array.isArray(body.history) ? body.history.slice(-6).map((message: { role?: string; content?: string }) => ({
      role: message.role === "assistant" ? "assistant" : "user", content: String(message.content ?? "").slice(0, 600),
    })) : [];
    if (question.length < 2 || !title) return Response.json({ error: "Ask a question about the lesson." }, { status: 400 });

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(25_000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini", store: false, max_output_tokens: 700,
        instructions: "You are a supportive tutor answering a learner's follow-up about the lesson below. Be accurate, concise, and kind. Build on the lesson's analogy and vocabulary. If a question goes beyond the lesson, answer briefly and say so. Use plain text with short paragraphs.",
        input: JSON.stringify({ lesson: { title, objective, chapters }, conversation: history, newQuestion: question }),
      }),
    });
    if (!upstream.ok) {
      const status = upstream.status;
      await upstream.body?.cancel();
      return Response.json({ error: status === 429 ? "The tutor is busy right now. Please retry in a moment." : "The tutor could not answer just now. Please retry." }, { status: status === 429 ? 429 : 502 });
    }
    const payload = await upstream.json();
    const answer = payload.output?.flatMap((item: { type?: string; content?: Array<{ type?: string; text?: string }> }) =>
      item.type === "message" ? item.content?.filter((content) => content.type === "output_text").map((content) => content.text ?? "") ?? [] : [],
    ).join("").trim();
    if (!answer) return Response.json({ error: "The tutor returned an empty answer. Please try again." }, { status: 502 });
    return Response.json({ answer });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "The tutor took too long to respond. Please try again." : "The tutor could not answer just now. Please retry.";
    return Response.json({ error: message }, { status: 502 });
  }
}
