const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { extractFromText } = require("../helper/geminiHelper");
const ChatMessage = require("../model/message");
const File = require("../model/file");
const { cacheMiddleware, invalidateCache } = require("../helper/cache");

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
    const {
      text,
      sentBy,
      patientId,
      roomId,
      senderName,
      doctorId,
      pathologyId,
    } = req.body;
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

      const fileRecord = new File({

        doctorId: doctorId || null,
        patientId: patientId,
        name: req.file.originalname,
        type: req.file.mimetype,

        path: path,
        uploadDate: new Date(),
        extractedReports: [],
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

      await message.save();
      await invalidateCache("chat");
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
      await invalidateCache("chat");
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

chatRouter.get("/:roomId", cacheMiddleware("chat", 5), async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ roomId }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Chat fetch error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = chatRouter;
