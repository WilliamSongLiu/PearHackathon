import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
app.use(express.json());

import apiKeys from './apiKeys.json' assert { type: 'json' };
const openai = new OpenAI({
  apiKey: apiKeys.openai
});

app.get('/', (req, res) => {
  res.json({
    test: 'Hello, World!'
  });
});

app.get('/image', (req, res) => {
  const imagePath = `./images/${req.query.file}`;
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), imagePath));
});

app.get('/setup-story', (req, res) => {
  res.json({
    success: true
  });
});

app.get('/generate-scene', (req, res) => {
  res.json({
    success: true,
    backgroundImageFile: "test.jpg"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});