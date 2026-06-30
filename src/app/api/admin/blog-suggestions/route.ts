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

    const { specialty } = await req.json();

    const prompt = `You are a healthcare content expert. Generate 5 trendy, SEO-friendly blog post ideas for a hospital blog about ${
      specialty || "general health"
    }. 
    
    For each idea, provide:
    1. Blog title (catchy, SEO-optimized)
    2. Brief description (2-3 sentences)
    3. Estimated read time
    4. Key SEO keywords
    
    Format as JSON array with objects containing: title, description, readTime, keywords`;

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.choices[0]?.message?.content || "";

    // Parse the JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Blog suggestion error:", errorMessage);
    console.error("Full error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions", details: errorMessage },
      { status: 500 }
    );
  }
}
