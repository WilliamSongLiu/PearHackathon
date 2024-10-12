
export const setup_plot_system_prompt = `Create a comprehensive pitch for a visual novel plot, focusing on a central struggle and a significant decision. Include detailed background and world setting, an in-depth main character description, and a list of 4 side characters with brief descriptions.

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

export const generate_scene_system_prompt = `Create a scene for a visual novel by considering the provided background, characters, previous scenes, and the decision point that appears at the story's end. Your task is to construct a complete scene based on this information.

# Steps

1. **Character Inclusion**: Identify and list the characters who will participate in the scene.
2. **Setting Description**: Create a vivid description of the scene's setting, incorporating visual and atmospheric details.
3. **Dialogue Construction**: Develop a sequence of dialogue pieces, attributing each piece to a character or the narrator. Ensure that the dialogue advances the story and aligns with the characters’ personalities.
4. **Integration with Story Arc**: Make sure the scene progresses the narrative towards the big decision at the story’s end, considering the distance to that endpoint.

# Output Format

- **Characters**: List of characters in the scene.
- **Setting**: A detailed, visual description of the scene's setting.
- **Dialogue**: A sequence of dialogue, formatted with character or narrator attribution.

# Notes

- The dialogue should reflect each character's unique voice and contribute toward narrative development.
- Consider the pacing of the story and the progression indicator to ensure appropriate advancement towards the story's climax.
- Maintain consistency in tone and style with previous scenes if there are any provided.

# Examples

- **Characters**: 
  - [Character Name 1]
  - [Character Name 2]

- **Setting**: 
  - [A detailed description of the setting, including time of day, environment details, mood, etc.]

- **Dialogue**:
  - [Character Name 1]: "This is an example of what a character might say."
  - [Character Name 2]: "Respond accordingly to advance the conversation."
  - [Narrator]: "Explain any nonverbal actions or setting shifts here." 

(Each example should be adapted to your characters and setting, with placeholders and style matching the actual content specifics)'`;

export const physical_description_system_prompt = `Create a detailed physical appearance description for a character based on the provided character description.

# Steps

1. **Analyze the Description**: Carefully read the given character description to understand key traits, personality, and any available physical attributes.
2. **Identify Key Physical Traits**: Extract any explicit physical characteristics mentioned (e.g. height, hair color, eye color).
3. **Infer Additional Attributes**: Based on the character's personality and role, infer additional physical traits that may suit them (e.g. posture, clothing style).
4. **Comprehensive Description**: Combine explicit traits and inferred details to compose a coherent and vivid description of the character's physical appearance.

# Output Format

The output should be a single, detailed paragraph describing the character's physical appearance, incorporating both explicit information and inferred traits where relevant.

# Examples

**Input**: "A mysterious, scholarly wizard with an air of intrigue."

**Output**: "The wizard stands tall and lean, with a mane of silver hair that cascades down his shoulders, framing a face marked by sharply defined features. His eyes, a piercing blue, seem to hold countless mysteries and wisdom beyond his years. His skin is pale, adding to his ethereal appearance, and a long, dark robe embroidered with arcane symbols drapes elegantly from his shoulders, giving him a regal presence. In one hand, he clutches an ancient staff, while the other frequently reaches to adjust the round spectacles perched on his nose, a testament to his scholarly nature."

**Notes**

- Ensure creativity while maintaining coherence in the description.
- The inferred traits should logically follow from the character's description and context.
- The description should be vivid enough to allow a mental image of the character.`;