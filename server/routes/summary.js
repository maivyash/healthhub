const express = require("express");
const File = require("../model/file");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { summarizeHealthTrends } = require("../helper/summarisehalthtrend");

const summaryRouter = express.Router();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyAoJrcEFgXEZL-OuFRj9s-eEBFxd1yddsA"
);

// ----------------- Helper to Flatten and Normalize -------------------
const normalizeKey = (key) =>
  key
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

const flattenReports = (files) => {
  const allParams = {};
  files.forEach((file) => {
    file.extractedReports?.forEach((report) => {
      const date = new Date(report.reportDate).toISOString().split("T")[0];
      const params = report.parameters || {};

      for (const key in params) {
        const val = params[key];

        if (typeof val === "object" && val !== null) {
          for (const subKey in val) {
            const flatKey = normalizeKey(`${key}_${subKey}`);
            allParams[flatKey] = allParams[flatKey] || [];
            allParams[flatKey].push({ value: val[subKey], date });
          }
        } else {
          const flatKey = normalizeKey(key);
          allParams[flatKey] = allParams[flatKey] || [];
          allParams[flatKey].push({ value: val, date });
        }
      }
    });
  });

  return allParams;
};

// ----------------- AI Summary Endpoint -------------------
summaryRouter.get("/ai", async (req, res) => {
  try {
    const files = await File.find({}).sort({ uploadDate: -1 }).lean();
    if (!files.length)
      return res.status(400).json({ error: "No reports found" });

    const allData = flattenReports(files);

    const prompt = `
You are an expert healthcare AI.

From this patient's report history, do 3 things:
1. Summarize the patient's health in **less than 100 words**.
2. Suggest a 7-day **exercise plan** for them.
3. Suggest a 7-day **diet plan**.

Normalize similar keys (e.g., WBC = White Blood Cell Count, etc.).
Choose top 10 relevant health parameters by importance.

Return output only in **pure JSON** as:
{
  "summary": "short summary here...",
  "plan": {
    "exercise": ["Day 1: ...", ..., "Day 7: ..."],
    "diet": ["Day 1: ...", ..., "Day 7: ..."]
  }
}

Here is the extracted report data:
${JSON.stringify(allData, null, 2)}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonClean = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonClean);
    res.json(parsed);
  } catch (err) {
    console.error("Gemini summary failed:", err.message || err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

// fallback summary (optional)
summaryRouter.get("/", async (req, res) => {
  const files = await File.find();

  const allReports = files.flatMap((file) =>
    file.extractedReports.map((report) => ({
      date: report.reportDate,
      reportType: report.reportType,
      parameters: report.parameters,
    }))
  );

  const aiSummary = await summarizeHealthTrends(allReports);

  if (!aiSummary) {
    return res
      .status(500)
      .json({ error: "Gemini could not summarize reports" });
  }

  res.json(aiSummary); // send to frontend
});

module.exports = summaryRouter;
