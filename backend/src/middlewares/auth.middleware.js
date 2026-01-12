const jwt = require("jsonwebtoken");
const userModel = require("../models/User.model");

const authMiddleware = async (req, res, next) => {

    const { accessToken } = req.cookies;
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(accessToken, process.env.JWTSECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in middleware: ", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {authMiddleware}