import OpenAI from 'openai';
import chalk from 'chalk';
import apiKeys from '../apiKeys.json' with { type: 'json' };
import { storySchema, actSchema } from '../schemas.js';
import { zodResponseFormat } from 'openai/helpers/zod';
import { setup_plot_system_prompt, generate_act_system_prompt, summarize_act_system_prompt } from '../prompts.js';
import { generateImage, generateVoice } from './assetGeneration.js';

const openai = new OpenAI({ apiKey: apiKeys.openai });
const model = 'gpt-4o-mini';

let actIndex = 0;
let storySetup = {};
let sceneSummaries = [];
let choicesMade = [];
let lastChoices = [];
let sceneSummaryPromise = null;

export const setupStory = async (genre, playerName) => {
    console.log(chalk.blue("setupStory"));

    actIndex = 0;
    storySetup = {};
    sceneSummaries = [];
    choicesMade = [];
    sceneSummaryPromise = null;

    const prompt = `Generate a plot for a super short ${genre || 'pumpkin'} visual novel. The main character is named ${playerName || 'Pooja'}.`;
    const messages = [
        { role: 'system', content: setup_plot_system_prompt },
        { role: 'user', content: prompt },
    ];
    console.log(prompt);

    const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: messages,
        response_format: zodResponseFormat(storySchema, 'storySetup'),
    });

    storySetup = completion.choices[0].message.parsed;
    return storySetup;
};

export const generateAct = async (choiceIndex) => {
    console.log(chalk.blue("generateAct"));

    if (sceneSummaryPromise !== null) {
        const sceneSummary = await sceneSummaryPromise;
        sceneSummaries.push(sceneSummary.choices[0].message.content);
        choicesMade.push(lastChoices[choiceIndex]);
    }

    actIndex++;

    let prompt;
    if (choiceIndex == -1) {
        prompt = `This is the first act in the story. Begin the story.`;
    }
    else {
        prompt = `This is act ${actIndex} in the story. Here's what happened in prior acts.\n`;
        for (let i = 0; i < sceneSummaries.length; i++) {
            prompt += `${i + 1}.\nSummary: ${sceneSummaries[i]}\nPlayer's choice: ${choicesMade[i]}\n`;
        }
    }
    const messages = [
        { role: 'system', content: generate_act_system_prompt },
        { role: 'user', content: prompt },
    ];
    console.log(prompt);

    const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: messages,
        response_format: zodResponseFormat(actSchema, 'actOverview'),
    });

    const act = completion.choices[0].message.parsed;

    // Generate image for the act
    const imageFileName = await generateImage(act.setting);
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

export const makeChoice = (choice) => {
    console.log(chalk.blue("makeChoice"));

    choicesMade.push(choice);
}

const summarizeScene = async (sceneJson) => {
    console.log(chalk.blue("summarizeScene"));

    const prompt = `Summarize this scene: ${JSON.stringify(sceneJson)}`;
    const messages = [
        { role: 'system', content: summarize_act_system_prompt },
        { role: 'user', content: prompt },
    ];
    console.log(prompt);

    return await openai.chat.completions.create({
        model: model,
        messages: messages
    });
};
