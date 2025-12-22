const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    project: "Sellio",
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// Start server only after DB connects
const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`🚀 Sellio API running on port ${port}`));
};

start();
