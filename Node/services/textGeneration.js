import OpenAI from 'openai';
import apiKeys from '../apiKeys.json' assert { type: 'json' };
import { storySchema, actSchema } from '../schemas.js';
import { zodResponseFormat } from 'openai/helpers/zod';
import { setup_plot_system_prompt, generate_scene_system_prompt, physical_description_system_prompt, summarize_scene_system_prompt } from '../prompts.js';

const openai = new OpenAI({ apiKey: apiKeys.openai });
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
        model: 'gpt-4o',
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
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: generate_scene_system_prompt },
            { role: 'user', content: prompt },
        ],
        response_format: zodResponseFormat(actSchema, 'actOverview'),
    });

    n_act++;
    const act = completion.choices[0].message.parsed;
    sceneSummaryPromise = summarizeScene(act.dialogue);
    lastChoices = act.choices;
    return act;
};

export const makeChoice = (choice) => choicesMade.push(choice);

const summarizeScene = async (sceneJson) => {
    const prompt = `Summarize this scene: ${JSON.stringify(sceneJson)}`;
    return await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: summarize_scene_system_prompt },
            { role: 'user', content: prompt },
        ],
    });
};
