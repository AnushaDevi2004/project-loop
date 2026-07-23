import Anthropic from "@anthropic-ai/sdk";

console.log("Claude API Key Loaded:", !!process.env.ANTHROPIC_API_KEY);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeWithClaude(comment: string) {
  console.log("Mock AI analyzing:", comment);

  return {
    sentiment: "Positive",
    score: 0.94,
    summary: "The feedback is generally positive.",
    keywords: "easy, fast, helpful",
    strengths: "Good UI, Fast performance",
    improvements: "Add more features",
    recommendation: "Continue improving the user experience",
  };
}