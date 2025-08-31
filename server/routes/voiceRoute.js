// server/routes/voiceRoute.js

const express = require('express');
const router = express.Router();

// Import Gemini service functions for intent extraction and generation
const { extractIntentFromGemini, generateFromGemini } = require('../services/geminiService');

/**
 * Route: POST /
 * Description: Extracts intent from user’s voice/text input using Gemini.
 * Request Body: { text: string }
 * Response: JSON with extracted intent
 */
router.post('/', async (req, res) => {
  try {
    // Call Gemini service to extract intent from user input
    const result = await extractIntentFromGemini(req.body.text);
    res.json(result);
  } catch (err) {
    console.error('❌ Gemini Error:', err); // Log the actual error for debugging
    res.status(500).send('Failed to extract intent');
  }
});

/**
 * Route: POST /recommend
 * Description: Generates shopping recommendations based on user's shopping history.
 * Request Body: { history: array of past shopping items }
 * Response: JSON { recommendations: [] }
 */
router.post('/recommend', async (req, res) => {
  const { history } = req.body;

  // Prompt to guide Gemini to generate recommendation JSON array
  const prompt = `
You are a helpful assistant. Based on the user's shopping history below, recommend 5 items they might want to buy again or are seasonally relevant or low in stock (e.g., one left or two).

Shopping history: ${JSON.stringify(history)}

Respond ONLY as a JSON array of item strings with good sentence. Example:
["hey wanna drink milk u might feel healthy", "eat bread fill your stomach", "fresh mangoes in the house grab them","grapes are into the season smash them","have a good time to buy a new pen"]
`;

  try {
    // Generate recommendations using Gemini service
    const result = await generateFromGemini(prompt);
    const json = JSON.parse(result); // Parse Gemini response into JSON
    res.json({ recommendations: json });
  } catch (err) {
    console.error('🔁 Recommendation fetch failed:', err); // Log errors
    res.status(500).json({ recommendations: [] }); // Return empty array on failure
  }
});

module.exports = router;
