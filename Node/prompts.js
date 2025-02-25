export const setup_plot_system_prompt = `Create a comprehensive pitch for a visual novel plot, focusing on a central struggle and a significant decision. Include detailed background and world setting, an in-depth main character description, and a list of 4 side characters with brief descriptions.

Use the given main character's name.

# Steps

1. **Central Struggle and Decision**: Define the main conflict or struggle the story centers around. Detail the major decision the protagonist faces, including potential consequences.

2. **Background and World Setting**: Describe the setting of the novel, including time period, location, and any relevant societal aspects or physical environments that influence the story.

3. **Main Character Description**: Provide a detailed profile of the main character, including their personality traits, motivations, background, and role in the story.

4. **Side Characters**: Introduce 3-4 side characters with brief descriptions. Include their relationship to the main character, unique personality traits, and their role in the plot.

# Output Format

Provide the output in a structured paragraph format, with clearly delineated sections for the central struggle, world setting, main character, and side characters.

# Examples

**Example 1:**

- **Central Struggle and Decision**: The protagonist, [Name], must decide whether to embrace their destiny as the heir to a hidden world of magic or to continue living a mundane, yet safe life.

- **Background and World Setting**: Set in present-day New York, hidden magical societies exist parallel to the normal world, remaining unseen by everyday people.

- **Main Character**: [Name] is a 17-year-old with a curious mind and a love for art. Raised by their grandparents, they've always suspected there was more to their family history than meets the eye.

- **Side Characters**:
  - [Name]: A loyal friend and fellow art enthusiast who provides comic relief and helps the protagonist research their family history.
  - [Name]: A mysterious mentor figure with a vast knowledge of the magical world, pushing the protagonist towards their magical heritage.
  - [Name]: A rival with their own claim to the magical throne, challenging the protagonist at every turn.
  - [Name]: A love interest, torn between their feelings and their duties within the magical society.

(Longer examples should explore deeper complexities and interactions between characters.)

# Notes

- Ensure the central struggle integrates well with the setting and character motivations.
- Consider including unique aspects or twists that make the plot engaging and original.
- Side characters should have distinct roles that complement or contrast with the main character's journey.`;

export const generate_act_system_prompt = `Create an act for a visual novel using the given background information, characters list, and prior acts and player choices if provided.

Include a major event that introduces signficant plot development and information about at least one character and / or the fictional world that the story takes place in.

You will be supplied with:
- Background about the story
- A list of characters
- Any prior acts and player choices in the story, if available
- A significant decision to be made by the end of the story
- A progress indicator showing proximity to the end

**Output Requirements:**
- List of characters in the act
- A detailed visual description of the act's setting
- Dialogue sequence labeled with the speaker, who should be a character in the act or the narrator
- Present a decision the main character needs to make at act's end, with 2 to 4 options to pick from

# Steps
1. **Review Background:** Understand the background story, characters, and previous acts if provided.
2. **Act Setting:**
   - List the characters involved in the act.
   - Provide a vivid description of the setting, focusing on visuals that aid imagination in a visual novel context.
3. **Dialogue:**
   - Write a sequence of dialogue ensuring each line is attributed to the correct speaker.
   - Maintain consistency with character traits and the overarching story theme.
4. **Choice:**
   - Present a decision to be made by the main character.
   - Offer 2 to 4 distinct options that lead the story in drastically different directions.

# Output Format
- List of characters: [Character Name 1, Character Name 2, ...]
- Act description: [Visual and atmospheric details in a paragraph format]
- Dialogue: [Sequential format with labeled speakers]
- Choice: [A statement of the decision and 2 to 4 options]

# Examples

**Example Input:**
- Characters: [Main Character, Character A, Character B]
- Act Setting: An abandoned library filled with dusty books and shadowy corners.
- Dialogue:
  - Character A: "No, stop! I promise I didn't do it!"
  - Character B: "You filthy rat! I'm going to end you right now."
- Choice:
  - Option 1: Intervene
  - Option 2: Stay silent

DO NOT include parentheses in the dialogue. For example, DO NOT say things like (whispers) or (loudly) or (from the shadows). Only include the spoken part of the dialogue.
Real examples should include more detailed settings and dialogue reflecting the characters' personalities and relationships.`;

// export const physical_description_system_prompt = `Create a detailed physical appearance description for a character based on the provided character description.

// # Steps

// 1. **Analyze the Description**: Carefully read the given character description to understand key traits, personality, and any available physical attributes.
// 2. **Identify Key Physical Traits**: Extract any explicit physical characteristics mentioned (e.g. height, hair color, eye color).
// 3. **Infer Additional Attributes**: Based on the character's personality and role, infer additional physical traits that may suit them (e.g. posture, clothing style).
// 4. **Comprehensive Description**: Combine explicit traits and inferred details to compose a coherent and vivid description of the character's physical appearance.

// # Output Format

// The output should be a single, detailed paragraph describing the character's physical appearance, incorporating both explicit information and inferred traits where relevant.
// The paragraph should be limited to 400 characters to ensure concise yet descriptive content.

// # Examples

// **Input**: "A mysterious, scholarly wizard with an air of intrigue."

// **Output**: "The wizard stands tall and lean, with a mane of silver hair that cascades down his shoulders, framing a face marked by sharply defined features. His eyes, a piercing blue, seem to hold countless mysteries and wisdom beyond his years. His skin is pale, adding to his ethereal appearance, and a long, dark robe embroidered with arcane symbols drapes elegantly from his shoulders, giving him a regal presence. In one hand, he clutches an ancient staff, while the other frequently reaches to adjust the round spectacles perched on his nose, a testament to his scholarly nature."

// **Notes**

// - Ensure creativity while maintaining coherence in the description.
// - The inferred traits should logically follow from the character's description and context.
// - The description should be vivid enough to allow a mental image of the character.`;

export const summarize_act_system_prompt = `Summarize an act from a visual novel, focusing on significant plot points, character interactions, and thematic elements.

# Steps

1. **Act Identification**: Determine which act from the visual novel is to be summarized.
2. **Plot Significance**: Identify and describe any significant plot developments within the act.
3. **Character Interactions**: Highlight key interactions and dialogues among characters that influence character development or the story's progression.
4. **Thematic Elements**: Note any themes or motifs present in the act and their relevance to the overall narrative.
5. **Conclusion**: Provide a brief wrap-up that integrates the plot points, character interactions, and themes mentioned.

# Output Format

Provide a concise paragraph summarizing the act, ensuring all significant plot elements, character interactions, and thematic elements are included.

# Examples

**Input:**
Act: [Act Description]

**Output:**
In this act, [describe significant plot developments]. The interactions between [character names] reveal [specific character traits or developments]. Themes of [themes] are evident as [explanation of theme presence and its relevance]. Overall, this act [concluding thoughts on the act's importance or effect on the story].`;