const mongoose = require("mongoose");
const bidModel = require("../models/bid.model");
const gigModel = require("../models/gig.model");

const submitBid = async (req, res) => {
  try {
    const { gigId, message } = req.body;
    if (!gigId || !message)
      return res.status(400).json({ message: "GigId or message is missing!" });

    const gig = await gigModel.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found." });
    console.log("Gig is: ", gig);

    if (gig.ownerId.equals(req.user._id)) {
      return res.status(400).json({ message: "Can't bid on own gig!" });
    }

    if (gig.status === "assigned")
      return res.status(400).json({ message: "Gig already assigned!" });

    const bidExists = await bidModel.findOne({
      gigId,
      freelancerId: req.user._id,
    });
    if (bidExists)
      return res
        .status(400)
        .json({ message: "You already have a bid on this gig!" });

    const bid = await bidModel.create({
      gigId,
      freelancerId: req.user._id,
      message,
    });
    res.status(201).json({ message: "Bid created successfully", bid });
  } catch (err) {
    console.error("Error in posting bid route: ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const getAllBids = async (req, res) => {
  try {
    const { gigId } = req.query;
    if (!gigId) return res.status(400).json({ message: "GigId is required." });

    const gig = await gigModel.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (!gig.ownerId.equals(req.user._id))
      return res
        .status(403)
        .json({ message: "You can't view bids on this gig!" });

    const bids = await bidModel
      .find({ gigId })
      .populate("freelancerId", "name email");
    if (bids.length === 0)
      return res.status(200).json({ message: "No bids yet", bids: [] });

    res.status(200).json({ message: "Fetched bids successfully", bids });
  } catch (err) {
    console.error("Error in fetching bids for a gig route: ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const acceptBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { bidId } = req.params;
    if (!bidId) return res.status(400).json({ message: "BidId is required." });

    const bid = await bidModel.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await gigModel.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Gig not found" });
    }

    if (!gig.ownerId.equals(req.user._id)) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "You can't accept bids on this gig!" });
    }

    if (gig.status === "assigned") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Gig already assigned" });
    }

    await bidModel.findByIdAndUpdate(bidId, { status: "hired" }, { session });

    await bidModel.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" },
      { session }
    );

    await gigModel.findByIdAndUpdate(
      gig._id,
      { status: "assigned" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Bid accepted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in accept bid:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { submitBid, getAllBids, acceptBid };
