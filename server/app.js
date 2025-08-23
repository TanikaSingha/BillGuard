require("dotenv").config();
const express = require("express");
const connectDB = require("./database/connectDB");
const authRouter = require("./routes/authRouter");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use(errorHandler);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
