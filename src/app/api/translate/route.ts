import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Server-side memory cache: source string -> Hindi translation.
// Shared across all visitors, so repeated UI strings are translated once.
const cache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const { texts } = await request.json();

    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: "texts must be an array" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const result: string[] = new Array(texts.length);
    const missIdx: number[] = [];
    const missTexts: string[] = [];

    texts.forEach((t: unknown, i: number) => {
      const s = typeof t === "string" ? t : String(t);
      const cached = cache.get(s);
      if (cached !== undefined) {
        result[i] = cached;
      } else {
        missIdx.push(i);
        missTexts.push(s);
      }
    });

    if (missTexts.length > 0) {
      const systemPrompt =
        'You are a professional English-to-Hindi translator for a hospital website in Narnaul, Haryana. ' +
        'You receive a JSON object {"items": [...]} containing English UI/content strings. ' +
        'Translate each string into natural, simple, everyday Hindi (Devanagari script) that a local patient understands. ' +
        'Keep unchanged: numbers, phone numbers, emails, URLs, times, and common English proper nouns / brand names / medical abbreviations ' +
        '(for example: Vijay Hospital, NABH, ICU, OPD, MRI, CT, X-ray, and doctor names). ' +
        'Preserve the original punctuation, capitalization of kept English words, and meaning. ' +
        'Return ONLY a JSON object of the exact same shape and order: {"items": [...translated strings, same count...]}.';

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify({ items: missTexts }) },
          ],
          temperature: 0.2,
          max_tokens: 8000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        return NextResponse.json(
          { error: "Translation upstream failed", detail },
          { status: 502 }
        );
      }

      const data = await response.json();
      let items: string[] = [];
      try {
        const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
        items = Array.isArray(parsed.items) ? parsed.items : [];
      } catch {
        items = [];
      }

      missIdx.forEach((origIdx, j) => {
        const translated =
          typeof items[j] === "string" && items[j].length > 0 ? items[j] : missTexts[j];
        cache.set(missTexts[j], translated);
        result[origIdx] = translated;
      });
    }

    return NextResponse.json({ translations: result });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
