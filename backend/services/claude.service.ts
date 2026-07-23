import Anthropic from "@anthropic-ai/sdk";

console.log("Claude API Key Loaded:", !!process.env.ANTHROPIC_API_KEY);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeWithClaude(comment: string) {
  const prompt = `
You are an AI assistant helping employers analyze employee or candidate feedback.

Analyze the following feedback and return ONLY valid JSON.

Feedback:
"${comment}"

Return in this exact format:

{
  "sentiment": "Positive | Neutral | Negative",
  "score": 0.95,
  "summary": "...",
  "keywords": "...",
  "strengths": "...",
  "improvements": "...",
  "recommendation": "..."
}
`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 500,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.content[0];

  if (text.type !== "text") {
    throw new Error("Unexpected response from Claude");
  }

  return JSON.parse(text.text);
}