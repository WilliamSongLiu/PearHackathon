import OpenAI from 'openai';
import apiKeys from '../apiKeys.json' with { type: 'json' };
import { storySchema, actSchema } from '../schemas.js';
import { zodResponseFormat } from 'openai/helpers/zod';
import { setup_plot_system_prompt, generate_scene_system_prompt, summarize_scene_system_prompt } from '../prompts.js';
import { generateImage, generateVoice } from './assetGeneration.js';

const openai = new OpenAI({ apiKey: apiKeys.openai });
const model = 'gpt-4o-mini';

let n_act = 1;
let storySetup = {};
let sceneSummaries = [];
let choicesMade = [];
let lastChoices = [];
let sceneSummaryPromise = null;

export const setupStory = async (genre, playerName) => {
    n_act = 1;
    storySetup = {};
    sceneSummaries = [];
    choicesMade = [];
    sceneSummaryPromise = null;

    const prompt = `Generate a plot for a 5-minute ${genre || 'pumpkin'} visual novel. The main character is named ${playerName || 'Pooja'}.`;
    const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: [
            { role: 'system', content: setup_plot_system_prompt },
            { role: 'user', content: prompt },
        ],
        response_format: zodResponseFormat(storySchema, 'storySetup'),
    });

    storySetup = completion.choices[0].message.parsed;
    return storySetup;
};

export const generateAct = async (choiceIndex) => {
    if (sceneSummaryPromise !== null) {
        const sceneSummary = await sceneSummaryPromise;
        sceneSummaries.push(sceneSummary.choices[0].message.content);
        choicesMade.push(lastChoices[choiceIndex]);
    }

    const prompt = `Act ${n_act}: Generate a scene based on previous acts and setup.`;
    const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: [
            { role: 'system', content: generate_scene_system_prompt },
            { role: 'user', content: prompt },
        ],
        response_format: zodResponseFormat(actSchema, 'actOverview'),
    });

    n_act++;
    const act = completion.choices[0].message.parsed;

    // Generate image for the act
    const imageFileName = await generateImage(`Scene from Act ${n_act}: ${act.setting}`);
    act.imageFile = imageFileName;

    // Generate voice files for each dialogue line
    const voiceFiles = [];
    for (const line of act.dialogue) {
        const voiceFileName = await generateVoice(line.line, line.speaker);
        voiceFiles.push({ speaker: line.speaker, file: voiceFileName });
    }
    act.voiceFiles = voiceFiles;

    sceneSummaryPromise = summarizeScene(act.dialogue);
    lastChoices = act.choices;

    return act;
};

export const makeChoice = (choice) => choicesMade.push(choice);

const summarizeScene = async (sceneJson) => {
    const prompt = `Summarize this scene: ${JSON.stringify(sceneJson)}`;
    return await openai.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: summarize_scene_system_prompt },
            { role: 'user', content: prompt },
        ],
    });
};
