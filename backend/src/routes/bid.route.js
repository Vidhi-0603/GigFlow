const express = require("express");
const { submitBid, getAllBids, acceptBid } = require("../controllers/bid.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, submitBid);
router.get("/", authMiddleware, getAllBids);
router.patch("/:bidId/hire", authMiddleware,acceptBid);

module.exports = router;