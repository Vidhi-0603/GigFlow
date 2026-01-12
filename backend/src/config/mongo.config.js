const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log("Mongoose state:", mongoose.connection.readyState);

    if (conn) console.log("connection to DB successful");
    else console.log("connection failed!");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;