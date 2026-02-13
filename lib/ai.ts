// lib/ai.ts
export async function callOpenRouter(task: 'EXTRACT' | 'SCORE', input: string) {
  const prompts = {
    EXTRACT: {
      system: "Extract coupon data into JSON: {code: string, discount: string, store: string, expiry: string}. Return ONLY JSON.",
      model: "google/gemini-flash-1.5"
    },
    SCORE: {
      system: "Analyze coupon validity. Return JSON: {confidence: number (0-1), status: 'ACTIVE'|'EXPIRED', reason: string}.",
      model: "anthropic/claude-3-haiku"
    }
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: prompts[task].model,
      messages: [
        { role: "system", content: prompts[task].system },
        { role: "user", content: input }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
