import chalk from 'chalk';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { setupStory, generateAct, makeChoice } from './services/textGeneration.js';

const app = express();
const PORT = 3000;
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesFolder = path.join(__dirname, 'images');
const audiosFolder = path.join(__dirname, 'audios');

if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);
if (!fs.existsSync(audiosFolder)) fs.mkdirSync(audiosFolder);

app.get('/setup-story', async (req, res) => {
    try {
        const response = await setupStory(req.query.genre, req.query.playerName);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

app.get('/generate-act', async (req, res) => {
    try {
        const act = await generateAct(req.query.optionIndex);
        res.json(act);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

app.get('/image', (req, res) => {
    console.log(chalk.blue(`image ${req.query.file}`));
    res.sendFile(path.join(imagesFolder, req.query.file));
});
app.get('/audio', (req, res) => {
    console.log(chalk.blue(`audio ${req.query.file}`));
    res.sendFile(path.join(audiosFolder, req.query.file))
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
