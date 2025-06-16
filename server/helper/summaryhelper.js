const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set your API key from environment variable or directly here (not recommended)
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyAoJrcEFgXEZL-OuFRj9s-eEBFxd1yddsA"
);
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
            const unified = `${key}_${subKey}`;
            if (!allParams[unified]) allParams[unified] = [];
            allParams[unified].push({ date, value: val[subKey] });
          }
        } else {
          if (!allParams[key]) allParams[key] = [];
          allParams[key].push({ date, value: val });
        }
      }
    });
  });
  return allParams;
};
