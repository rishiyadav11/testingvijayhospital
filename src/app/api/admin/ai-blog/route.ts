import { NextRequest, NextResponse } from 'next/server';

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function getToken(req: NextRequest) {
  return req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
}

async function groq(messages: { role: string; content: string }[], maxTokens = 2000) {
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content as string;
}

/**
 * Groq sometimes emits literal newlines/tabs inside JSON string values.
 * JSON.parse rejects those as "bad control character". This scanner
 * walks char-by-char and escapes them only while inside a string token.
 */
function fixJson(raw: string): string {
  let out = '';
  let inStr = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    // toggle inStr on unescaped quote
    if (c === '"' && raw[i - 1] !== '\\') {
      inStr = !inStr;
      out += c;
    } else if (inStr) {
      if (c === '\n') out += '\\n';
      else if (c === '\r') out += '\\r';
      else if (c === '\t') out += '\\t';
      else out += c;
    } else {
      out += c;
    }
  }
  return out;
}

function parseJson(text: string, arrayMode: boolean) {
  const pattern = arrayMode ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = text.match(pattern);
  if (!match) throw new Error('AI returned an unexpected format — please try again');
  return JSON.parse(fixJson(match[0]));
}

// POST /api/admin/ai-blog
// body: { mode: 'suggest', specialty } | { mode: 'write', title, specialty }
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { mode } = body;

    // ── SUGGEST MODE ─────────────────────────────────────────────────
    if (mode === 'suggest') {
      const { specialty } = body as { specialty: string };

      const text = await groq([
        {
          role: 'system',
          content:
            'You are a medical content strategist for Vijay Hospital, a multi-specialty hospital in Narnaul, Haryana, India. ' +
            'Generate blog topic suggestions that are medically accurate, SEO-friendly, and relevant to Indian patients.',
        },
        {
          role: 'user',
          content:
            `Generate 6 compelling blog topic suggestions for the specialty: "${specialty}".\n\n` +
            'Each must be a concrete, specific title that answers a common patient question, is relevant to Indian patients in Haryana, and has good SEO potential.\n\n' +
            'Return ONLY a valid JSON array — no markdown, no explanation:\n' +
            '[{"title":"...","angle":"one sentence describing the article","readTime":"X min"},...]',
        },
      ], 800);

      const suggestions = parseJson(text, true);
      return NextResponse.json({ success: true, suggestions });
    }

    // ── WRITE MODE ───────────────────────────────────────────────────
    if (mode === 'write') {
      const { title, specialty } = body as { title: string; specialty: string };

      const text = await groq([
        {
          role: 'system',
          content:
            'You are an expert medical content writer for Vijay Hospital, a NABH-accredited multi-specialty hospital in Narnaul, Haryana, India. ' +
            'Write medically accurate, engaging blog content for Indian patients. ' +
            'End every article with a call to action mentioning Vijay Hospital (+91 93067 10615). ' +
            'Use clear headings and bullet points. Write in a warm, trustworthy tone.',
        },
        {
          role: 'user',
          content:
            `Write a complete, publish-ready hospital blog post.\nTitle: "${title}"\nSpecialty: ${specialty}\n\n` +
            'Return ONLY a valid JSON object — no markdown fences, no explanation:\n' +
            '{"title":"...","excerpt":"150 chars max SEO excerpt","content":"full markdown 600-900 words",' +
            '"category":"one of: Cardiology|Orthopedics|Neurology|Pediatrics|Maternity|Emergency|General Wellness|Mental Wellness|Pulmonology|Geriatrics|Endocrinology|Dermatology|Ophthalmology|ENT|Nutrition|Health Tips",' +
            '"keywords":"5-8 comma-separated keywords","readTime":"X min","author":"Vijay Hospital Medical Team",' +
            '"seoTitle":"60 chars max","seoDesc":"155 chars max"}',
        },
      ], 3000);

      const blog = parseJson(text, false);

      blog.slug = (blog.title as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      return NextResponse.json({ success: true, blog });
    }

    return NextResponse.json({ success: false, error: 'Invalid mode' }, { status: 400 });

  } catch (err) {
    console.error('[ai-blog]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'AI generation failed' },
      { status: 500 }
    );
  }
}
