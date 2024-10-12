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
const audiosFolder = path.join(__dirname, 'audios');
if (!fs.existsSync(audiosFolder)){
  fs.mkdirSync(audiosFolder);
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

app.get('/audio', (req, res) => {
  console.log(`audio ${req.query.file}`);

  res.sendFile(path.join(audiosFolder, req.query.file));
});

app.get('/setup-story', (req, res) => {
  res.json({
    success: true
  });
});

app.get('/get-scene', async (req, res) => {
  console.log('get-scene');

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

app.get('/get-voice', async (req, res) => {
  console.log('get-voice');

  res.json({
    success: true,
    backgroundImageFile: await generateVoice('testasiojfdiojasidofjioa')
  });
});

const generateVoice = async (passage) => {
  console.log('generateVoice');

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: passage,
    response_format: 'wav'
  });

  const fileName = `${Date.now()}.wav`;
  const filePath = path.join(audiosFolder, fileName);

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);

  return fileName;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});