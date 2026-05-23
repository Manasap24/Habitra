const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Habitra Backend Running");
});

app.post("/test", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Data received successfully",
  });
});

console.log(process.env.GEMINI_API_KEY);

app.post("/api/ai", async (req, res) => {
  try {
    const { completedHabits, pendingHabits } = req.body;

    const prompt = `
    Completed habits: ${completedHabits.join(", ")}

    Pending habits: ${pendingHabits.join(", ")}

    Give 1 short productivity suggestion.
    `;

    
    const suggestion =
      "Try completing pending habits earlier in the day for better consistency.";
    res.json({
      suggestion
    });
  } catch (error) {
    console.log(error.response?.status, error.response?.data || error.message);

    res.status(500).json({
      suggestion: "Error generating AI suggestion",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/hello", (req, res) => {
  res.send("Hello from backend");
});
