const authRoutes = require("./src/routes/auth.route.js");
const gigRoutes = require("./src/routes/gig.route.js");
const bidRoutes = require("./src/routes/bid.route.js");

const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const connectDB = require("./src/config/mongo.config.js");
connectDB();

const cookieparser = require("cookie-parser");
app.use(cookieparser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
