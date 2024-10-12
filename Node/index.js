import express from 'express';
import OpenAI from 'openai';

const app = express();
const PORT = 3000;

import apiKeys from './apiKeys.json' assert { type: 'json' };
const openai = new OpenAI({
  apiKey: apiKeys.openai
});

let storyPrompt = "In a world where the sun was always shining"

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Utility function to call OpenAI API and return the completion
const generateCompletion = async (model, messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return completion.choices[0].message.content; // Access the first completion choice
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
};

// Define route for generating a joke
app.get('/chat', async (req, res) => {
  try {
      const prompt = req.params.prompt;
    const completion = await generateCompletion('gpt-4', [
      { role: 'user', content: prompt },
    ]);
    res.send(completion);
  } catch (error) {
    res.status(500).send('Error generating completion');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});