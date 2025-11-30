const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// ENV variables
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
const routes = require("./routes/index");
app.use("/api", routes);

// Home route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
