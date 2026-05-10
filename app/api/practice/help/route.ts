import { NextResponse } from "next/server";
import { getGroqResponse } from "@/lib/groqService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      code, userCode, 
      language, lang,
      challengeTitle, challengeId,
      challengeDescription, context,
      error 
    } = body;

    const finalCode = code || userCode || "";
    const finalLang = language || lang || "python";
    const finalTitle = challengeTitle || challengeId || "Current Task";
    const finalDesc = challengeDescription || context || "";

    const prompt = `
I am working on a coding task titled "${finalTitle}".
Description: ${finalDesc}
Language: ${finalLang}

My current code is:
\`\`\`${finalLang}
${finalCode}
\`\`\`

${error ? `I am getting the following error or feedback:\n${error}` : "I am stuck and need a hint."}

Please provide:
1. A subtle hint that doesn't give away the answer but points me in the right direction.
2. A step-by-step guide (conceptual) on how to solve this.

Remember: Do NOT provide the full solution code. Be educational. Keep it concise but helpful.
`;

    const reply = await getGroqResponse(prompt, {
      behavior: { noDirectSolutions: true },
      currentChallenge: finalTitle,
    });

    return NextResponse.json({ 
      reply,
      hint: reply // For backward compatibility with some frontend calls
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Server error", details: msg }, { status: 500 });
  }
}
