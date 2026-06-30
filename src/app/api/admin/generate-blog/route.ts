import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { verifyAdminToken } from "@/lib/auth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    // Verify admin token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, specialty, keywords } = await req.json();

    const prompt = `You are a professional healthcare content writer for a hospital blog. Write a comprehensive, SEO-optimized blog post on the topic: "${title}".

Specialty: ${specialty}
SEO Keywords to include: ${keywords?.join(", ") || "health, wellness, medical"}

Requirements:
1. Write 1500-2000 words
2. Include 3-4 sections with H2 headers
3. Start with an engaging introduction
4. Include a practical tips or advice section
5. End with a strong conclusion and CTA
6. Use markdown formatting
7. Make it engaging and informative for patients
8. Include credibility statements about the hospital

Format the response as:
# Blog Title
[Introduction]
## Section 1
[Content]
## Section 2
[Content]
## Section 3
[Content]
## Tips & Advice
[Practical tips]
## Conclusion
[Conclusion with CTA]`;

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.choices[0]?.message?.content || "";

    // Extract SEO metadata
    const seoMeta = {
      title: title,
      metaDescription: `${title} - Learn about this important health topic from Vijay Hospital's healthcare experts. Get professional advice and guidance.`,
      keywords: keywords || [title],
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
    };

    return NextResponse.json({
      content: content,
      seoMeta,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blog generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog content" },
      { status: 500 }
    );
  }
}
