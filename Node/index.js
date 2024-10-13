import express from 'express';
import OpenAI from 'openai';

import { generate_scene_system_prompt, setup_plot_system_prompt, physical_description_system_prompt, summarize_scene_system_prompt } from './prompts.js';
import { actSchema, storySchema } from './types.js';
import { zodResponseFormat } from "openai/helpers/zod";

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';

const GPT = 'gpt-4o';
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
let last_choices = [];

const voices = ["fable", "nova", "shimmer", "alloy", "echo"]

import apiKeys from './apiKeys.json' assert { type: 'json' };
const openai = new OpenAI({
  apiKey: apiKeys.openai
});

app.get('/setup-story', async (req, res) => {
  try {
    // Restart
    n_act = 1;
    scene_summaries = [];
    choices_made = [];
    character_descriptions = {};
    sceneSummaryPromise = null;

    const completion = await generateStorySetup(req.query.genre ?? "pumpkin", req.query.playerName ?? "Pooja");
    console.log("generateStorySetup completion\n", completion);
    story_setup = completion;

    const characterPromises = completion.sideCharacters.map(character => ({
      name: character.name,
      promise: generatePhysicalDescription(character.description)
    }));

    characterPromises.push({
      name: completion.mainCharacter.name,
      promise: generatePhysicalDescription(completion.mainCharacter.description)
    });

    // Now wait for all promises to resolve
    Promise.all(characterPromises.map(entry => entry.promise))
    .then(results => {
      results.forEach((result, index) => {
        character_descriptions[characterPromises[index].name] = result;
      });
    })
    .catch(error => {
      console.error(error);  // Handle any error
    });

    console.log("start-story / generatePhysicalDescriptions suceeded");

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
});

app.get('/generate-act', async (req, res) => {
  try {
    if (sceneSummaryPromise !== null) {
      const sceneSummary = await sceneSummaryPromise;
      // console.log("completed sceneSummary", sceneSummary);
      scene_summaries.push(sceneSummary.choices[0].message.content);
      choices_made.push(last_choices[req.query.choiceIndex]);
    }
    const completion = await generateAct();
    n_act++;
    sceneSummaryPromise = summarizeScene(completion.dialogue);
    last_choices = completion.choices;

    const relevant_character_descriptions = completion.characters.map((key, index) => {
      if (key in character_descriptions) {
        return `${key}: ${character_descriptions[key]}`;
      } else {
        return "";
      }
    }).join("\n");
    const image_gen_prompt = `Generate an image for this setting: ${completion.setting} with the characters: ${completion.characters.join(', ')}

    Here's what each character looks like in this scene:
    ${relevant_character_descriptions}
    `;

    const backgroundImageFile = await generateBackgroundImage(image_gen_prompt);
    const result = {
      backgroundImageFile: backgroundImageFile,
      dialogues: completion.dialogue,
      choices: completion.choices
    }

    res.send(result);
    return result;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
});

app.get('/make-choice', async (req, res) => {
  choices_made.push(req.params.choice);
});


const generateStorySetup = async (genre, playerName) => {
  try {
    const prompt = `Generate a plot for a 5 minute ${genre} visual novel. The main character is named ${playerName}.`

    const messages = [
      { role: 'system', content: setup_plot_system_prompt },
      { role: 'user', content: prompt }
    ]

    const completion = await openai.beta.chat.completions.parse({
      model: GPT,
      messages: messages,
      response_format: zodResponseFormat(storySchema, "story_setup"),
    });

    const return_value = completion.choices[0].message.parsed;
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
      model: GPT,
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
      model: GPT,
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
      model: GPT,
      messages: messages,
    });

    return completion;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}



// ------ Audio / Image stuff

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesFolder = path.join(__dirname, 'images');
if (!fs.existsSync(imagesFolder)){
  fs.mkdirSync(imagesFolder);
}
const audiosFolder = path.join(__dirname, 'audios');
if (!fs.existsSync(audiosFolder)){
  fs.mkdirSync(audiosFolder);
}

app.get('/image', (req, res) => {
  console.log(`/image ${req.query.file}`);

  res.sendFile(path.join(imagesFolder, req.query.file));
});

app.get('/audio', (req, res) => {
  console.log(`/audio ${req.query.file}`);

  res.sendFile(path.join(audiosFolder, req.query.file));
});

const generateBackgroundImage = async (prompt) => {
  console.log(`generateBackgroundImage ${prompt}`);

  const response = await openai.images.generate({
    model: DALL_E,
    prompt: prompt,
    size: '1792x1024',
    quality: 'standard',
    n: 1
  });
  const imageUrl = response.data[0].url;

  const imageResponse = await axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream'
  });

  const fileName = `${Date.now()}.png`;
  const filePath = path.join(imagesFolder, fileName);

  const writer = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    imageResponse.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  console.log(`generateBackgroundImage returned ${fileName}`);
  return fileName;
}

app.get('/generate-voice', async (req, res) => {
  console.log('/generate-voice');

  const characterName = req.query.speaker;

  let voice = "onyx";
  console.log("character_descriptions", character_descriptions, characterName, characterName in character_descriptions)
  if (characterName in character_descriptions) {
    const voice_i = Object.keys(character_descriptions).findIndex(key => key === characterName)
    voice = voices[voice_i % voices.length];
  }

  res.json({
    success: true,
    voiceAudioFile: await generateVoice(req.query.line, voice)
  });
});

const generateVoice = async (line, voice) => {
  console.log(`generateVoice ${line}`);

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: voice,
    input: line,
    response_format: 'mp3'
  });

  const fileName = `${Date.now()}.mp3`;
  const filePath = path.join(audiosFolder, fileName);

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);

  console.log(`generateVoice returned ${fileName}`);
  return fileName;
}



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});