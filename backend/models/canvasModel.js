const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  elements: [{ type: mongoose.Schema.Types.Mixed }],
  name: { type: String, default: "Untitled", maxlength: 20 }, // Added name field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Canvas", canvasSchema);
