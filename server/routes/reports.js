const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const File = require("../model/file");
const { extractFromText } = require("../helper/geminiHelper");

const reports = express.Router();

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// Remove duplicate keys from Gemini output (safe fallback)
const cleanParameters = (params) => {
  const cleaned = {};
  for (const key in params) {
    if (!cleaned.hasOwnProperty(key)) {
      cleaned[key] = params[key];
    }
  }
  return cleaned;
};

reports.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file type" });
    }

    try {
      const filePath = req.file.path;
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const text = pdfData.text;

      if (!text || text.length < 100) {
        return res.status(400).json({ error: "PDF content is unreadable." });
      }

      let aiExtracted = await extractFromText(text);

      if (!aiExtracted) {
        return res
          .status(500)
          .json({ error: "Gemini failed to extract content." });
      }

      // ✅ Normalize output
      if (!Array.isArray(aiExtracted)) {
        console.log("ℹ️ Gemini returned a single report. Converting to array.");
        aiExtracted = [aiExtracted];
      }

      const extractedReports = aiExtracted.map((report) => ({
        reportType: report.reportType || "Unknown",
        parameters: cleanParameters(report.parameters || {}),
        reportDate: report.reportDate
          ? new Date(report.reportDate)
          : new Date(),
      }));

      const file = new File({
        name: req.file.originalname,
        type: req.file.mimetype,
        path: filePath,
        uploadDate: new Date(),
        extractedReports,
      });

      await file.save();

      res.json({
        message: "✅ File and reports saved successfully",
        count: extractedReports.length,
      });
    } catch (err) {
      console.error("❌ Upload failed:");
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
      res
        .status(500)
        .json({ error: err.message || "Failed to process the uploaded PDF" });
    }
  });
});

reports.get("/files", async (req, res) => {
  const files = await File.find();
  res.json(files);
});

module.exports = reports;
