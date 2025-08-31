const axios = require('axios');
const db = require('../firebase'); // ✅ Firebase should already be initialized

/**
 * Cleans Gemini's JSON output by removing markdown formatting like ```json ... ```
 * @param {string} text - Raw text from Gemini API
 * @returns {string} Cleaned JSON string
 */
function cleanJsonResponse(text) {
  return text
    .replace(/```json\s*/i, '')
    .replace(/```/g, '')
    .trim();
}

/**
 * Extracts shopping intent and recommendations using Gemini API.
 * Enhances user input by processing past shopping history if needed.
 * 
 * @param {string} userText - Raw user command
 * @returns {Promise<object>} Parsed JSON with intent and item details
 */
async function extractIntentFromGemini(userText) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are a smart voice shopping assistant.

Task:
1. Identify the intent:
   - "add_to_list": add item to shopping list
   - "remove_from_list": remove item
   - "search_item": search for a product or apply filters

2. Extract fields:
   - item: product name (singular, lowercase)
   - quantity: default 1 (only add/remove)
   - category: classify item (e.g., dairy, snacks, vegetables, beverages)
   - price: realistic unit price in dollar
   - brand: if mentioned, else "any"
   - size: if mentioned, else "any"
   - price_range: only for search; object with min/max, default 0
   - filters: only for search; keys like brand and size, default "any"
   - search_term: user query (singular form)

Rules:
- Respond only in raw JSON, no markdown/explanations
- No null/undefined values
- Quantity and price must be numbers
- Formats:

Add/remove:
{
  "intent": "add_to_list" | "remove_from_list",
  "item": "<item>",
  "quantity": <number>,
  "category": "<category>",
  "price": <number>,
  "brand": "<brand>",
  "size": "<size>"
}

Search:
{
  "intent": "search_item",
  "search_term": "<term>",
  "filters": {
    "brand": "<brand>",
    "size": "<size>"
  },
  "price_range": {
    "min": <number>,
    "max": <number>
  }
}

If not a shopping command, respond exactly:
"Not a shopping command."

User input: "${userText}"
Languages: Hindi, Marathi, Tamil, etc. Translate to English if needed.
`;

  try {
    const response = await axios.post(
      `${url}?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("🌐 Gemini Response:", JSON.stringify(response.data, null, 2));

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleaned = cleanJsonResponse(rawText);

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    throw new Error("Failed to extract intent from Gemini response.");
  }
}

/**
 * Generates raw text from Gemini API using a custom prompt
 * @param {string} promptText - Input prompt for Gemini
 * @returns {Promise<string>} Raw response text
 */
async function generateFromGemini(promptText) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${url}?key=${apiKey}`,
      { contents: [{ parts: [{ text: promptText }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return raw?.replace(/```json|```/g, '').trim();
  } catch (err) {
    console.error('❌ Gemini generation failed:', err.message);
    throw new Error('Gemini generation failed');
  }
}

module.exports = {
  extractIntentFromGemini,
  generateFromGemini
};
