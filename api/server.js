const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log("✅ " + req.path, req.method, req.body);
  next();
});

//routes
const userRouter = require("./routes/user-router");
const ttsRouter = require("./routes/tts-router");
const authRouter = require("./routes/auth-router");

app.use("/api/user/", userRouter);
app.use("/api/tts/", ttsRouter);
app.user("/api/auth/", authRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to database");
    // Listen to request
    app.listen(process.env.PORT, process.env.DOMAIN, () => {
      console.log(
        `✅ Server started on ${process.env.DOMAIN}:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
