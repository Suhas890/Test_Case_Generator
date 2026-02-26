const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",  // or "gemini-flash-latest", "gemini-2.5-pro"
      generationConfig: {
        temperature: 0.2,          // lower = more deterministic/strict
        responseMimeType: "application/json",  // ← forces JSON mime type
      },
      // ────────────────────────────────────────────────
      // Structured Output Schema (forces valid JSON)
      // ────────────────────────────────────────────────
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            input: { type: "STRING", description: "Full input as string" },
            output: { type: "STRING", description: "Expected output as string" },
            explanation: { type: "STRING", description: "Short reason" }
          },
          required: ["input", "output", "explanation"]
        }
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Because of responseSchema + mimeType, this should be clean JSON array
    console.log("=== RAW STRUCTURED RESPONSE ===");
    console.log(text);
    console.log("=================================");

    const parsed = JSON.parse(text);
    return parsed;

  } catch (error) {
    console.error("Gemini structured call failed:", error);
    throw new Error("Gemini API error: " + (error.message || "Unknown"));
  }
}

module.exports = { callGemini };