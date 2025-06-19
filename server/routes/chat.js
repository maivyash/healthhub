const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { extractFromText } = require("../helper/geminiHelper");
const ChatMessage = require("../model/message");
const File = require("../model/file");

const chatRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDFs allowed"), false),
});

chatRouter.post("/send", upload.single("file"), async (req, res) => {
  try {
    const { text, sentBy, patientId, roomId, senderName } = req.body;
    if (!text && !req.file) {
      return res
        .status(400)
        .json({ error: "Message text or file is required" });
    }

    if (!sentBy || !roomId || !patientId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: sentBy, roomId, patientId" });
    }

    if (req.file) {
      const path = req.file.path;
      const pdfBuffer = fs.readFileSync(path);
      const extractedText = (await pdfParse(pdfBuffer)).text;
      4;
      if (!extractedText) {
        return res.status(482).json({ error: "PDF is not readable" });
      }
      const aiExtracted = await extractFromText(extractedText);
      if (!aiExtracted) {
        return res.status(482).json({ error: "AI failed" });
      }

      const fileRecord = new File({
        patientId: patientId,
        name: req.file.originalname,
        type: req.file.mimetype,

        path: path,
        uploadDate: new Date(),
        extractedReports: [
          {
            reportType: aiExtracted.reportType || "Unknown",
            parameters: aiExtracted.parameters || {},
            reportDate: aiExtracted.reportDate
              ? new Date(aiExtracted.reportDate)
              : new Date(),
          },
        ],
      });

      await fileRecord.save();
      const message = new ChatMessage({
        text,
        sentBy,
        patientId,
        roomId,
        senderName: senderName || "Unknown", // fetch from User if needed
        file: {
          filename: req.file.originalname,
          filepath: path,
          filetype: req.file.mimetype,
        },
      });
      console.log("Saving message:", {
        text,
        roomId,
        sentBy,
        patientId,
        naame: req.file.originalname,
        path,
        file: req.file.mimetype,
      });
      console.log("Schema file type:", ChatMessage.schema.path("file"));

      await message.save();
      res.status(200).json(message);
    } else {
      const message = new ChatMessage({
        text,
        sentBy,
        patientId,
        roomId,
        senderName: senderName || "Unknown", // fetch from User if needed
      });
      console.log("Saving message:", {
        text,
        roomId,
        sentBy,
        patientId,
      });

      await message.save();
      res.status(200).json(message);
    }
  } catch (err) {
    console.error("Chat send error:", err);

    // Avoid crashing the app
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
});

chatRouter.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const messages = await ChatMessage.find({ roomId }).sort({ sentAt: 1 });
  res.json(messages);
});

module.exports = chatRouter;
