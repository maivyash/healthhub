const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("../model/file"); // Mongoose model

const fileRouter = express.fileRouter();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"), false);
  },
});

fileRouter.post("/upload", upload.single("file"), async (req, res) => {
  const { uploadedBy, patientId, roomId } = req.body;

  if (!uploadedBy || !patientId || !roomId || !req.file) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      uploadedBy,
      patientId,
      roomId,
      uploadedAt: new Date(),
    });

    await newFile.save();

    return res.status(200).json({
      message: "File uploaded",
      url: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = fileRouter;
