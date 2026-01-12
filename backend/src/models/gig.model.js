const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open",
  },
});

gigSchema.index({ ownerId: 1 });
gigSchema.index({ status: 1 });
gigSchema.index({
  title: "text",
  description: "text",
});

const gigModel = mongoose.model("Gig", gigSchema);
module.exports = gigModel;
