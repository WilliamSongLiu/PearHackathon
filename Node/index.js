import express, { json } from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate_scene_system_prompt, setup_plot_system_prompt, physical_description_system_prompt, summarize_scene_system_prompt } from './prompts.js';
import { actSchema, storySchema } from './types.js';
import { zodResponseFormat } from "openai/helpers/zod";

const GPT_4o = 'gpt-4o';
const DALL_E = 'dall-e-3';

const TOTAL_ACTS = 5;

const app = express();
const PORT = 3000;
app.use(express.json());

let story_setup = {};
let scene_summaries = [];
let choices_made = [];
let character_descriptions = {};
let n_act = 1;
let sceneSummaryPromise = null;

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
    // Restart
    n_act = 1;
    scene_summaries = [];
    choices_made = ["1", "2", "3"];
    character_descriptions = {};  
    sceneSummaryPromise = null;

    const completion = await generateStorySetup(req.params.prompt ?? "mystery");
    console.log("completion\n", completion);
    story_setup = completion;

    // console.log("completion.sideCharacters\n", completion.sideCharacters);

    const characterPromises = completion.sideCharacters.map(character => ({
      name: character.name,
      promise: generatePhysicalDescription(character.description)
    }));

    characterPromises.push({
      name: completion.mainCharacter.name,
      promise: generatePhysicalDescription(completion.mainCharacter.description)
    });

    // console.log(characterPromises)

    // Now wait for all promises to resolve
    Promise.all(characterPromises.map(entry => entry.promise))
    .then(results => {
      results.forEach((result, index) => {
        character_descriptions[characterPromises[index].name] = result;
      });

      // console.log(character_descriptions)
    })
    .catch(error => {
      console.error(error);  // Handle any error
    });


    res.send(completion);
    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
});

app.get('/get-next-act', async (req, res) => {
  try {
    if (sceneSummaryPromise !== null) {
      const sceneSummary = await sceneSummaryPromise;
      console.log("completed sceneSummary", sceneSummary);
      scene_summaries.push(sceneSummary.choices[0].message.content);
    }
    const completion = await generateAct(req.params.prompt ?? "mystery");
    n_act++;

    console.log("trying to summarize", completion.dialogue, choices_made);
    sceneSummaryPromise = summarizeScene(completion.dialogue);


    // scene_summaries.push(completion);

    // choices_made.push(completion.decision.choices[0]);

    // console.log("completion\n", completion);

    // scene_summaries.push(completion);

    res.send(completion);
    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
});

app.get('/update-made-choice', async (req, res) => {
  choices_made.push(req.params.choice);
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

const generateAct = async () => {
  try {
    const prompt = `I want you to create act ${n_act} for a visual novel that has ${TOTAL_ACTS} acts. This act should take about 40-60 seconds to read.

    The act should build upon the provided plot, list of previous scenes, and decision made by the main character in each scene. Keep in mind that the main decision will be made in act ${TOTAL_ACTS}.
    
    ######## PLOT ########
    ${JSON.stringify(story_setup)}

    ######## PREVIOUS SCENES AND DECISIONS ########
    ${scene_summaries.map((scene, index) => `---Scene ${index + 1}: ${scene}\nDecision made by main character at the end of the scene: ${choices_made[index]}`).join('\n\n')}
    `;

    console.log("generateAct prompt", prompt);

    const messages = [
      { role: 'system', content: generate_scene_system_prompt },
      { role: 'user', content: prompt }
    ]

    const completion = await openai.beta.chat.completions.parse({
      model: GPT_4o,
      messages: messages,
      response_format: zodResponseFormat(actSchema, "act_overview"),
    });


    const return_value = completion.choices[0].message.parsed;
    console.log("generateAct return_value", return_value);
    return return_value;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}

const summarizeScene = (scene_json) => {
  try {
    const prompt = `Summarize the scene: ${JSON.stringify(scene_json)}`;

    const messages = [
      { role: 'system', content: summarize_scene_system_prompt },
      { role: 'user', content: prompt }
    ]

    const completion = openai.chat.completions.create({
      model: GPT_4o,
      messages: messages,
    });

    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
