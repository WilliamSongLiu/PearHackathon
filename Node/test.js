import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesFolder = path.join(__dirname, 'images');
if (!fs.existsSync(imagesFolder)){
  fs.mkdirSync(imagesFolder);
}

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
  console.log(`image ${req.query.file}`);

  res.sendFile(path.join(imagesFolder, req.query.file));
});

app.get('/setup-story', (req, res) => {
  res.json({
    success: true
  });
});

app.get('/generate-scene', async (req, res) => {
  console.log('generate-scene');

  res.json({
    success: true,
    backgroundImageFile: await generateBackgroundImage('a black dog with a red hat')
  });
});

const generateBackgroundImage = async (prompt) => {
  console.log('generateBackgroundImage');

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    size: '1792x1024',
    quality: 'standard',
    n: 1
  });
  const imageUrl = response.data[0].url;

  const imageResponse = await axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream'
  });

  const fileName = `${Date.now()}.png`;
  const filePath = path.join(imagesFolder, fileName);

  const writer = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    imageResponse.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  return fileName;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});