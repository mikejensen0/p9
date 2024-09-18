const express = require("express");
const cors = require("cors");  // Import cors
const { OpenAI, RateLimitError } = require("openai");
const app = express();
const port = 3000;

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = "5d0a52f24e2c4a378150ceb02e32afa1";
app.use(cors());


const api = new OpenAI({
  apiKey,
  baseURL,
});

app.get("/api/completion", async (req, res) => {
  const systemPrompt = "You are a travel agent. Be descriptive and helpful";
  const userPrompt = req.query.prompt || "Tell me about San Francisco";
  try
  {
  const completion = await api.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

  let response = completion.choices[0].message.content;
  }
  catch (e )
  {
    if (e instanceof RateLimitError){
      response = ":)";
    }
    else{ 
      response = ":(";
    }
  }
  res.json({ response });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
