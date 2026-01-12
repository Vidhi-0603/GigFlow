const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "hired", 'rejected'],
    default: "pending",
  },
});

bidSchema.index({ gigId: 1 });
bidSchema.index({ gigId: 1, status: 1 });

const bidModel = mongoose.model("Bid", bidSchema);
module.exports = bidModel;