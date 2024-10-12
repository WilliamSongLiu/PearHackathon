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


export const actSchema = z.object({
    characters: z.array(z.string()),
    // .nonempty(),  // List of characters, non-empty array of strings
    setting: z.string(),  // Detailed description of the scene's setting, non-empty string
    dialogue: z.array(z.object({
      speaker: z.string(),  // Character or narrator attribution
      line: z.string()  // Dialogue line
    })),
    // .nonempty(),
    decision: z.object({
        statement: z.string().describe("Description about the decision being made"),
        choices: z.array(z.string())    // Two concise choices in bullet point format
        //   .length(2)
          .describe("Two distinct choices that align with the story's progress and character development")
    })
  });