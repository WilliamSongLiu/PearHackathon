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
        res.json({ success: true, storySetup: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to setup story' });
    }
});

app.get('/generate-act', async (req, res) => {
    try {
        const act = await generateAct(req.query.choiceIndex);
        res.json({ success: true, act });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to generate act' });
    }
});

app.get('/make-choice', (req, res) => {
    try {
        makeChoice(req.query.choice);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to make choice' });
    }
});

app.get('/image', (req, res) => res.sendFile(path.join(imagesFolder, req.query.file)));
app.get('/audio', (req, res) => res.sendFile(path.join(audiosFolder, req.query.file)));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
