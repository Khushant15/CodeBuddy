import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { code, language, context } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert Senior Code Reviewer at CodeBuddy.
Your goal is to provide constructive, encouraging, and highly technical feedback on a student's code.

Review the following ${language || 'programming'} code in the context of: "${context || 'General practice'}".

Provide your review in a structured format:
1. **Strengths**: What did the student do well?
2. **Improvements**: Specific suggestions to make the code cleaner, more efficient, or more idiomatic.
3. **Security/Edge Cases**: Any potential bugs or security concerns.
4. **Rating**: A score from 1-10 on readiness.

Be concise but thorough. Use markdown formatting.`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is my code:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
        ],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Groq API error:", errData);
      return NextResponse.json({ error: "AI Review failed" }, { status: 500 });
    }

    const data = await response.json();
    const review = data.choices?.[0]?.message?.content || "No review generated.";

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
