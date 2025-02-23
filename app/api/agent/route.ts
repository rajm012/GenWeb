import { NextRequest, NextResponse } from "next/server";

// ✅ Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing user input" }, { status: 400 });
    }
    // Call Agent.AI Webhook
    const response = await fetch("https://api-lr.agent.ai/v1/agent/cn0yf0xbzsa2550q/webhook/1a98d3b3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input: text }),
    });

    console.log("start")
    const data = await response.json();
    console.log("over")
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch AI response");
    }

    return NextResponse.json({ success: true, response: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
