
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

export const generate_scene_system_prompt = `Create a scene for a visual novel using the given background information, characters list, and prior scenes if provided.

Include a major event that introduces signficant plot development and information about at least one character and / or the fictional world that the story takes place in.

You will be supplied with:
- Background about the story
- A list of characters
- Any prior scenes in the story, if available
- A significant decision to be made by the end of the story
- A progress indicator showing proximity to the end

**Output Requirements:**
- List of characters in the scene.
- A detailed visual description of the scene's setting
- Dialogue sequence labeled with the speaker, who should be a character in the scene or the narrator
- Present a decision the main character needs to make at scene's end, with two choices to pick from

# Steps
1. **Review Background:** Understand the background story, characters, and previous scenes if provided.
2. **Scene Setting:**
   - List the characters involved in the scene.
   - Provide a vivid description of the setting, focusing on visuals that aid imagination in a visual novel context.
3. **Dialogue Creation:**
   - Write a sequence of dialogue ensuring each line is attributed to the correct speaker.
   - Maintain consistency with character traits and the overarching story theme.
4. **Decision Point:**
   - Present a decision to be made by the main character.
   - Offer two distinct choices that align with the story's progress and character development.

# Output Format
- List of characters: [Character Name 1, Character Name 2, ...]
- Scene description: [Visual and atmospheric details in a paragraph format]
- Dialogue: [Sequential format with labeled speakers]
- Decision: [A statement of the decision and two choices in a concise bullet point format]

# Examples

**Example Input:**
- Characters: [Character A, Character B]
- Scene Setting: An abandoned library filled with dusty books and shadowy corners.
- Dialogue:
  - Character A: "Do you think we'll find any answers here?"
  - Character B: "I hope so. We've been searching for so long."
- Decision: "Character A must decide whether to confront their fears or continue searching."
  - Choice 1: Confront fears and enter the darkest area of the library.
  - Choice 2: Keep searching the safer, well-lit parts.

DO NOT include parentheses in the output.
Real examples should include more detailed settings and dialogue reflecting the characters' personalities and relationships.`;


export const physical_description_system_prompt = `Create a detailed physical appearance description for a character based on the provided character description.

# Steps

1. **Analyze the Description**: Carefully read the given character description to understand key traits, personality, and any available physical attributes.
2. **Identify Key Physical Traits**: Extract any explicit physical characteristics mentioned (e.g. height, hair color, eye color).
3. **Infer Additional Attributes**: Based on the character's personality and role, infer additional physical traits that may suit them (e.g. posture, clothing style).
4. **Comprehensive Description**: Combine explicit traits and inferred details to compose a coherent and vivid description of the character's physical appearance.

# Output Format

The output should be a single, detailed paragraph describing the character's physical appearance, incorporating both explicit information and inferred traits where relevant.
The paragraph should be limited to 400 characters to ensure concise yet descriptive content.

# Examples

**Input**: "A mysterious, scholarly wizard with an air of intrigue."

**Output**: "The wizard stands tall and lean, with a mane of silver hair that cascades down his shoulders, framing a face marked by sharply defined features. His eyes, a piercing blue, seem to hold countless mysteries and wisdom beyond his years. His skin is pale, adding to his ethereal appearance, and a long, dark robe embroidered with arcane symbols drapes elegantly from his shoulders, giving him a regal presence. In one hand, he clutches an ancient staff, while the other frequently reaches to adjust the round spectacles perched on his nose, a testament to his scholarly nature."

**Notes**

- Ensure creativity while maintaining coherence in the description.
- The inferred traits should logically follow from the character's description and context.
- The description should be vivid enough to allow a mental image of the character.`;

export const summarize_scene_system_prompt = `Summarize a scene from a visual novel, focusing on significant plot points, character interactions, and thematic elements.

# Steps

1. **Scene Identification**: Determine which scene from the visual novel is to be summarized.
2. **Plot Significance**: Identify and describe any significant plot developments within the scene.
3. **Character Interactions**: Highlight key interactions and dialogues among characters that influence character development or the story's progression.
4. **Thematic Elements**: Note any themes or motifs present in the scene and their relevance to the overall narrative.
5. **Conclusion**: Provide a brief wrap-up that integrates the plot points, character interactions, and themes mentioned.

# Output Format

Provide a concise paragraph summarizing the scene, ensuring all significant plot elements, character interactions, and thematic elements are included.

# Examples

**Input:**
Scene: [Scene Description]

**Output:**
In this scene, [describe significant plot developments]. The interactions between [character names] reveal [specific character traits or developments]. Themes of [themes] are evident as [explanation of theme presence and its relevance]. Overall, this scene [concluding thoughts on the scene’s importance or effect on the story].`;