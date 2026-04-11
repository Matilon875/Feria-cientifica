import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  const { message, npc } = req.body;

  let systemPrompt = "Responde de forma educativa. Máximo 3-5 frases.";

  if (npc === "pasado") {
    systemPrompt = "Eres una representación histórica del contexto alemán de 1930. Responde de forma objetiva. Máximo 3-5 frases.";
  } 
  else if (npc === "presente") {
    systemPrompt = "Eres un analista político actual. Explica la ultraderecha moderna de forma objetiva. Máximo 3-5 frases.";
  } 
  else if (npc === "futuro") {
    systemPrompt = "Habla sobre posibles futuros políticos de forma educativa. Máximo 3-5 frases.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_tokens: 220, // 🔥 IMPORTANTE: rápido + barato
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error en la API" });
  }
});

// ✅ FIX RENDER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Servidor listo en puerto " + port);
});
