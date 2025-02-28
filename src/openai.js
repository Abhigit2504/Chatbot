import axios from "axios";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Load from .env
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
export async function sendMsgToGemini(prompt) {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching response from Gemini";
  }
}
