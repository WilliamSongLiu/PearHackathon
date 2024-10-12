import { z } from "zod";

const characterSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const decisionSchema = z.object({
    decision: z.string().describe("The core decision that the protagonist must make at the end of the story"),
    choices: z.array(z.string()).describe("The choices the protagonist has"),
});

export const storySchema = z.object({
  centralStruggleAndDecision: z.object({
    centralStruggle: z.string().describe("The main conflict or struggle the story centers around"),
    decision: decisionSchema,
  }),
  backgroundAndWorldSetting: z.object({
    description: z.string(), 
  }),
  mainCharacter: characterSchema,
  sideCharacters: z.array(characterSchema), 
});