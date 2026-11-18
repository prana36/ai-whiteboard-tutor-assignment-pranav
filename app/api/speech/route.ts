export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "Voice narration is not configured. Add OPENAI_API_KEY to the server environment." }, { status: 503 });

  let text = "";
  try {
    const body = await request.json();
    text = typeof body.text === "string" ? body.text.trim().slice(0, 4000) : "";
  } catch {
    return Response.json({ error: "Narration text is missing." }, { status: 400 });
  }
  if (!text) return Response.json({ error: "Narration text is missing." }, { status: 400 });

  try {
    const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(50_000),
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
        voice: "marin",
        input: text,
        instructions: "Speak clearly, warmly, and at a measured teaching pace. Pause briefly between ideas.",
        response_format: "mp3",
      }),
    });
    if (!upstream.ok) {
      const status = upstream.status;
      await upstream.body?.cancel();
      return Response.json({ error: status === 429 ? "Voice is temporarily busy or over its usage limit. Try browser voice instead." : "Voice narration could not be prepared. Try browser voice instead." }, { status: status === 429 ? 429 : 502 });
    }
    return new Response(upstream.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Voice narration could not reach the provider. Try browser voice instead." }, { status: 502 });
  }
}
