import { z } from 'zod';

export const characterSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const decisionSchema = z.object({
    decision: z.string(),
    choices: z.array(z.string()),
});

export const storySchema = z.object({
    centralStruggleAndDecision: z.object({
        centralStruggle: z.string(),
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
    setting: z.string(),
    dialogues: z.array(
        z.object({
            speaker: z.string(),
            line: z.string(),
        })
    ),
    choice: z.array(z.string()),
});