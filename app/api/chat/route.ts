import { NextResponse } from "next/server";
import { getGroqResponse } from "@/lib/groqService";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string")
      return NextResponse.json({ error: "Message required" }, { status: 400 });

    const reply = await getGroqResponse(message);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Server error", details: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "OK", hasKey: !!process.env.GROQ_API_KEY });
}
