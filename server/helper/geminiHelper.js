const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set your API key from environment variable or directly here (not recommended)
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyAoJrcEFgXEZL-OuFRj9s-eEBFxd1yddsA"
);

async function extractFromText(pdfText) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You're an expert in analyzing medical pathology reports. Given the following report text, do two things:
1. Identify the type of medical report: blood, urine, sugar, thyroid, lipid, etc.
2. Extract only the most relevant health parameters **specific to that type**.

Return a JSON response like:
{ 
  "reportType": "Blood Report",
  "parameters": {
    "hemoglobin": 14.5,
    "rbc": 4.79,
    "wbc": 10570,
    "platelets": 150000,
    "esr": 7
  },
  "reportDate": "2023-02-20"
}
  if (report is not medical based) {
    return null
  }
Here is the medical report text:
"""
${pdfText}
"""
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleaned = text
    .replace(/```json/i, "") // Remove opening markdown block
    .replace(/```/, "") // Remove closing markdown block
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse cleaned Gemini output:", cleaned);
    return null;
  }

  try {
    const jsonStart = text.indexOf("{");
    const jsonString = text.slice(jsonStart);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse Gemini output:", text);
    return null;
  }
}

module.exports = { extractFromText };
