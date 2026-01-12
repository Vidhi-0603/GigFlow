const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { postGig, getAllGigs } = require("../controllers/gig.controller");
const router = express.Router();

router.post("/", authMiddleware, postGig);
router.get("/",getAllGigs)

module.exports = router;