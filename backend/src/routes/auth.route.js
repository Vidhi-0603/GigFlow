const express = require("express");
const { registerUser, loginUser, authUser, logoutUser } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, authUser)
router.post("/logout", authMiddleware, logoutUser);

module.exports = router