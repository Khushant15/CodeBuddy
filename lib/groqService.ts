// lib/groqService.ts
// Used server-side only (in API routes) – exposes a simple fetch wrapper.
import { ContextualHelp } from "./chatTypes";

export async function getGroqResponse(userInput: string, context?: ContextualHelp): Promise<string> {
  try {
    let systemPrompt = "You are CodeBuddy AI — an expert, friendly coding assistant. Help users debug code, explain programming concepts clearly with examples, and guide them through learning challenges. Be concise, encouraging, and use code snippets when helpful. Format code with backticks.";

    if (context) {
      if (context.behavior?.noDirectSolutions) {
        systemPrompt += "\nCRITICAL: NEVER give the complete solution or code. Ask guiding questions that lead to understanding. Explain WHY, not just HOW.";
      }
      if (context.currentLesson) {
        systemPrompt += `\nThe student is currently working on the lesson: ${context.currentLesson}.`;
      }
      if (context.currentChallenge) {
        systemPrompt += `\nThe student is currently solving the challenge: ${context.currentChallenge}.`;
      }
      if (context.userLevel) {
        systemPrompt += `\nThe student's current level is ${context.userLevel}. Tailor your explanation to this level.`;
      }
      if (context.attempts && context.attempts > 0) {
        systemPrompt += `\nThe student has attempted this ${context.attempts} times already. Be patient and try a different angle of explanation.`;
      }
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: userInput },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      throw new Error("Groq API request failed");
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("Groq API fetch error:", error);
    return "⚠️ Sorry, there was a problem connecting to the AI service.";
  }
}
