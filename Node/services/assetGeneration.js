import OpenAI from 'openai';
import chalk from 'chalk';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import apiKeys from '../apiKeys.json' with { type: 'json' };

const openai = new OpenAI({ apiKey: apiKeys.openai });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesFolder = path.join(__dirname, '../images');
const audiosFolder = path.join(__dirname, '../audios');

const availableVoices = ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy'];
let speakerVoices = {};

export const generateImage = async (prompt) => {
    console.log(chalk.blue("generateImage"));
    console.log(prompt);

    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1792x1024',
        n: 1
    });

    const imageUrl = response.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const fileName = `${Date.now()}.png`;
    const filePath = path.join(imagesFolder, fileName);

    const writer = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
        imageResponse.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
    return fileName;
};

export const generateVoice = async (speaker, line) => {
    console.log(chalk.blue("generateVoice"));
    console.log(line);

    if (!(speaker in speakerVoices)) {
        speakerVoices[speaker] = availableVoices[Math.floor(Math.random() * availableVoices.length)];
    }

    const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: speakerVoices[speaker],
        input: line
    });
    const fileName = `${Date.now()}.mp3`;
    const filePath = path.join(audiosFolder, fileName);

    await fs.promises.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
    return fileName;
};
