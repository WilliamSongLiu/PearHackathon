import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate_scene_system_prompt, setup_plot_system_prompt } from './prompts.js';
import { storySchema } from './types.js';
import { zodResponseFormat } from "openai/helpers/zod";

const GPT_4o = 'gpt-4o';
const DALL_E = 'dall-e-3';

const app = express();
const PORT = 3000;
app.use(express.json());

let scenes = [];
let choices = [];
let descriptions = {};

import apiKeys from './apiKeys.json' assert { type: 'json' };
const openai = new OpenAI({
  apiKey: apiKeys.openai
});

app.get('/image', (req, res) => {
  const imagePath = `./images/${req.query.file}`;
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), imagePath));
});

app.get('/start-story', async (req, res) => {
  try {
    const completion = await generateStorySetup(req.params.prompt ?? "mystery");
    console.log("completion\n", completion);

    for (const character in completion.sideCharacters) {
      console.log(character);
      descriptions[character["name"]] = generatePhysicalDescription(character["description"]);
    }

    console.log(completion["mainCharacter"]);
    descriptions[completion["mainCharacter"]["name"]] = generatePhysicalDescription(character["description"]);

    await Promise.all(descriptions);
    console.log(descriptions)

    res.send(completion);
    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
});

const generateStorySetup = async (genre) => {
  try {
    const prompt = `Generate a plot for a 5 minute ${genre} visual novel`

    const messages = [
      { role: 'system', content: setup_plot_system_prompt },
      { role: 'user', content: prompt }
    ]

    // console.log(messages)

    const completion = await openai.beta.chat.completions.parse({
      model: GPT_4o,
      messages: messages,
      response_format: zodResponseFormat(storySchema, "story_setup"),
    });

    // console.log(completion)
    const return_value = completion.choices[0].message.parsed;
    // console.log(return_value);
    return return_value;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}

const generatePhysicalDescription = async (description) => {
  try {
    const messages = [
      { role: 'system', content: physical_description_system_prompt },
      { role: 'user', content: description }
    ]

    const completion = await openai.chat.completions.create({
      model: GPT_4o,
      messages: messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}

const generateScene = async (prompt) => {
  try {
    const messages = [
      { role: 'system', content: generate_scene_system_prompt },
      { role: 'user', content: prompt }
    ]
    
    // const completion = await generateCompletion(DALL_E, [
    //   { role: 'system', content: prompt },
    // ]);
    // return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}

// generateSceneDescription = async (prompt) => {
//   try {
//     const completion = await generateCompletion(DALL_E, [
//       { role: 'system', content: prompt },
//     ]);
//     return completion;
//   } catch (error) {
//     console.error('Error generating completion:', error);
//     throw error;
//   }
// }


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
