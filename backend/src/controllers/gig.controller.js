const gigModel = require("../models/gig.model");

const postGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Gig Details missing" });
    }

    const gig = await gigModel.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json({ message: "Gig created successfully", gig });
  } catch (err) {
    console.error("Error in postGig route: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllGigs = async (req, res) => {
  try {
    const { search } = req.query;
    let filters = {};

    // if (search) {
    //   filters = {
    //     $or: [
    //       { title: { $regex: search, $options: "i" } },
    //       { description: { $regex: search, $options: "i" } },
    //     ],
    //   };
    // }

    if (search) {
      filters = { $text: { $search: search } };
    }

    const gigs = await gigModel
      .find(filters)
      .populate("ownerId", " name email");
    res.status(200).json({ message: "Gigs fetch successful!", gigs });
  } catch (err) {
    console.error("Error in getAllgigs route", err.message);
  }
};

module.exports = { postGig, getAllGigs };
