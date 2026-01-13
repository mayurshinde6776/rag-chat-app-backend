import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Health check
app.get("/", (req, res) => {
  res.send("Express server with Hugging Face Router API is running 🚀");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working successfully" });
});

// Chat endpoint
const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  "Content-Type": "application/json",
};

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Call Router API with OpenAI-compatible format
    const response = await axios({
      method: "POST",
      url: HF_ROUTER_URL,
      headers: headers,
      data: {
        model: "openai/gpt-oss-120b:fastest",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      }
    });

    const botReply = response.data.choices?.[0]?.message?.content || "No response";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error processing chat:", error?.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
