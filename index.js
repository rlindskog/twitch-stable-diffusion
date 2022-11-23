import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import stabilityClient from "stability-client";
import dotenv from "dotenv";
dotenv.config();

const { generateAsync } = stabilityClient;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = process.env.DREAM_STUDIO_API_KEY;

app.post("/generate-image", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      throw new Error("No prompt");
    }
    console.log("Generating image with prompt:", prompt);
    const { images } = await generateAsync({
      prompt,
      apiKey,
      steps: 50,
      height: 512,
      width: 512,
    });
    const base64EncodedImage = images?.[0]?.buffer?.toString("base64");
    return res.json({ image: base64EncodedImage });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
});

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
