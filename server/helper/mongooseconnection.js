const { default: mongoose } = require("mongoose");
import dotenv from "dotenv";
dotenv.config();
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = { connectDB };
