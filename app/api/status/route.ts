export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    speechConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
}
