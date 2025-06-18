const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyAoJrcEFgXEZL-OuFRj9s-eEBFxd1yddsA"
);
const synonymMap = {
  wbc: ["white blood cell", "total leukocyte count", "wbc", "tlc"],
  rbc: ["red blood cell", "rbc"],
  hemoglobin: ["hb", "hemoglobin"],
  hba1c: ["hba1c", "glycosylated hemoglobin"],
  platelet_count: ["platelet count", "platelets"],
  creatinine: ["creatinine", "serum creatinine"],
  tsh: ["tsh", "thyroid stimulating hormone"],
  cholesterol_total: ["total cholesterol", "cholesterol total", "cholesterol"],
  vitamin_d: ["vitamin d", "25-oh vitamin d", "vitamin d3"],
  triglycerides: ["triglycerides", "serum triglycerides"],
};

function normalizeKey(rawKey) {
  const lower = rawKey.toLowerCase();
  for (const [normalized, variants] of Object.entries(synonymMap)) {
    if (variants.some((v) => lower.includes(v))) {
      return normalized;
    }
  }
  return rawKey; // if no match, return as-is
}

function cleanCodeBlock(text) {
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  return text.slice(jsonStart, jsonEnd);
}

function deduplicateParameters(data) {
  const map = new Map();

  data.forEach((entry) => {
    if (!entry.parameter || !Array.isArray(entry.values)) return;

    const existing = map.get(entry.parameter) || [];
    const combined = [...existing, ...entry.values];

    const deduped = [];
    const seenDates = new Set();

    for (const val of combined) {
      const key = new Date(val.date).toISOString().split("T")[0];
      if (!seenDates.has(key)) {
        deduped.push(val);
        seenDates.add(key);
      }
    }

    map.set(entry.parameter, deduped);
  });

  return Array.from(map.entries()).map(([parameter, values]) => ({
    parameter,
    values: values.sort((a, b) => new Date(a.date) - new Date(b.date)),
  }));
}

async function summarizeHealthTrends(reportData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are a medical data analyst AI. Given extracted medical reports in JSON format, analyze and summarize the top 10 most important health metrics — even if labeled differently (e.g., "WBC", "White Blood Cell", "Total Leukocyte Count").

Normalize different terms for the same metric. For example:
- "WBC", "White Blood Cell", "Total Leukocyte Count" → "WBC"
- "Hemoglobin", "HB" → "Hemoglobin"
- "RBC", "Red Blood Cell" → "RBC"

Only include parameters that appear across multiple dates. Output at least 10 key metrics.

Return the following JSON format:

[
  {
    "parameter": "Hemoglobin",
    "values": [
      { "value": 14.5, "date": "2023-02-20" },
      { "value": 13, "date": "2024-02-13" }
    ]
  },
  {
    "parameter": "WBC",
    "values": [
      { "value": 10570, "date": "2023-02-20" },
      { "value": 6.9, "date": "2014-02-10" }
    ]
  }
]

Here is the data:
${JSON.stringify(reportData, null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();

    const jsonClean = cleanCodeBlock(rawText);
    const parsed = JSON.parse(jsonClean);

    const grouped = {};

    for (const entry of parsed) {
      const normParam = normalizeKey(entry.parameter);

      if (!grouped[normParam]) grouped[normParam] = [];

      // append all values
      if (Array.isArray(entry.values)) {
        grouped[normParam].push(...entry.values);
      }
    }

    // Deduplicate and sort
    const final = Object.entries(grouped).map(([parameter, values]) => {
      const seen = new Set();
      const deduped = values.filter((v) => {
        const key = new Date(v.date).toISOString().split("T")[0];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return {
        parameter,
        values: deduped.sort((a, b) => new Date(a.date) - new Date(b.date)),
      };
    });

    // Ensure top 10
    return final.slice(0, 10);
  } catch (err) {
    console.error("Gemini summarization failed:", err);
    return null;
  }
}

module.exports = { summarizeHealthTrends };
