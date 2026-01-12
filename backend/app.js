const authRoutes = require("./src/routes/auth.route.js");
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

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
