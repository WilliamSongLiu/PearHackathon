import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { setup_plot_system_prompt } from './prompts.js';
import { storySchema } from './types.js';
import { zodResponseFormat } from "openai/helpers/zod";
// import { z } from "zod";

const GPT_4o = 'gpt-4o';
const DALL_E = 'dall-e-3';

const app = express();
const PORT = 3000;
app.use(express.json());

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
    const completion = await generateStorySetup(req.params.prompt);
    // messages = [{ role: 'system', content: prompt }]

    // const completion = await openai.chat.completions.create({
    //   model: model,
    //   messages: messages,
    // });

    // physical_appearance =
    // return completion.choices[0].message.content; // Access the first completion choice
    console.log(completion);
    res.send(completion);
    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
  // setup



});

const generateStorySetup = async (prompt) => {
  try {
    const prompt = `Generate a plot for a 5 minute mystery visual novel`

    const messages = [
      { role: 'system', content: setup_plot_system_prompt },
      { role: 'user', content: prompt }
    ]

    console.log(messages)

    const completion = await openai.chat.completions.create({
      model: GPT_4o,
      messages: messages,
      response_format: zodResponseFormat(storySchema, "story_setup"),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}

const generatePhysicalDescription = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: GPT_4o,
      messages: messages,
      response_format: zodResponseFormat(storySchema, "story_setup"),
    });

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
