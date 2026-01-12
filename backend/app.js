const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({ "message": "ok!" });
})

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
})