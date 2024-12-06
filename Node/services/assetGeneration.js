import OpenAI from 'openai';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import apiKeys from '../apiKeys.json' with { type: 'json' };

const openai = new OpenAI({ apiKey: apiKeys.openai });

const __dirname = path.dirname(import.meta.url);
const imagesFolder = path.join(__dirname, '../images');
const audiosFolder = path.join(__dirname, '../audios');

export const generateImage = async (prompt) => {
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1792x1024',
        n: 1,
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

export const generateVoice = async (line, speaker) => {
    const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: speaker,
        input: line,
    });
    const fileName = `${Date.now()}.mp3`;
    const filePath = path.join(audiosFolder, fileName);

    await fs.promises.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
    return fileName;
};
