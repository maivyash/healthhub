const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportType: String,
  reportDate: Date,
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
});

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  path: String,
  uploadDate: Date,

  extractedReports: [reportSchema],
});

module.exports = mongoose.model("File", fileSchema);
