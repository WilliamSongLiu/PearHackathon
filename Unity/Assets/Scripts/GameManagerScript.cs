using UnityEngine;
using UnityEngine.UI;
using TMPro;

[RequireComponent(typeof(AudioSource))]
public class GameManagerScript : MonoBehaviour
{
    public static GameManagerScript Instance { get; private set; }
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private AudioSource audioSource;

    [SerializeField] private Image backgroundImage;
    [SerializeField] private GameObject bottomPanel;
    [SerializeField] private TMP_Text speakerText;
    [SerializeField] private TMP_Text lineText;
    [SerializeField] private GameObject clickInterceptorPanel;
    [SerializeField] private GameObject choicePanel;
    [SerializeField] private GameObject loadingPanel;
    [SerializeField] private TMP_Text loadingText;
    [SerializeField] private GameObject choicePrefab;

    private enum State
    {
        StorySetup,
        GeneratingAct,
        Playing,
        Choice
    }
    private State state;

    [System.Serializable]
    private class Dialogue
    {
        public string speaker;
        public string line;
        public string voiceAudioFile;
    }

    private class Act
    {
        public string[] characters;
        public string setting;
        public Dialogue[] dialogues;
        public string[] choices;
        public string backgroundImageFile;
    }

    private Act currentAct;
    private int currentDialogueIndex;
    private int currentDialogueCharacterIndex;
    private float textInterval = 0.03f;
    private float lastTextUpdate;

    private void Start()
    {
        audioSource = GetComponent<AudioSource>();
        loadingText.text = "Building the world...";
        loadingPanel.SetActive(true);
        SetupStory();
    }

    private void SetupStory()
    {
        state = State.StorySetup;
        StartCoroutine(NetworkManagerScript.Instance.RequestJSON(
            $"/setup-story?genre={DataManager.genre}&playerName={DataManager.playerName}", response =>
            {
                loadingText.text = "Generating the story...";
                GenerateAct(-1);
            }));
    }

    private void GenerateAct(int choiceIndex)
    {
        loadingText.text = "Loading next act...";
        loadingPanel.SetActive(true);
        state = State.GeneratingAct;
        StartCoroutine(NetworkManagerScript.Instance.RequestJSON($"/generate-act?choiceIndex={choiceIndex}",
            response =>
            {
                currentAct = JsonUtility.FromJson<Act>(response);

                StartCoroutine(NetworkManagerScript.Instance.RequestImage(currentAct.backgroundImageFile, sprite =>
                {
                    backgroundImage.sprite = sprite;
                    StartPlayingAct();
                }));
            }));
    }

    private void StartPlayingAct()
    {
        loadingPanel.SetActive(false);
        bottomPanel.SetActive(false);
        clickInterceptorPanel.SetActive(false);
        choicePanel.SetActive(false);

        currentDialogueIndex = 0;
        state = State.Playing;

        PlayDialogue();
    }

    private void PlayDialogue()
    {
        if (currentDialogueIndex >= currentAct.dialogues.Length)
        {
            ShowChoices();
            return;
        }

        var dialogue = currentAct.dialogues[currentDialogueIndex];
        speakerText.text = dialogue.speaker;
        lineText.text = "";
        currentDialogueCharacterIndex = 0;
        lastTextUpdate = Time.time;

        if (!string.IsNullOrEmpty(dialogue.voiceAudioFile))
        {
            StartCoroutine(NetworkManagerScript.Instance.RequestAudio(dialogue.voiceAudioFile, audioClip =>
            {
                audioSource.Stop();
                audioSource.PlayOneShot(audioClip);

                bottomPanel.SetActive(true);
                clickInterceptorPanel.SetActive(true);
            }));
        }
        else
        {
            bottomPanel.SetActive(true);
            clickInterceptorPanel.SetActive(true);
        }
    }

    private void Update()
    {
        if (state == State.Playing && Time.time - lastTextUpdate >= textInterval)
        {
            if (currentDialogueCharacterIndex < currentAct.dialogues[currentDialogueIndex].line.Length)
            {
                currentDialogueCharacterIndex++;
                lineText.text = currentAct.dialogues[currentDialogueIndex].line.Substring(0, currentDialogueCharacterIndex);
                lastTextUpdate = Time.time;
            }
        }
    }

    public void ClickInterceptorClicked()
    {
        if (currentDialogueCharacterIndex < currentAct.dialogues[currentDialogueIndex].line.Length)
        {
            // Skip to the end of the dialogue
            lineText.text = currentAct.dialogues[currentDialogueIndex].line;
            currentDialogueCharacterIndex = currentAct.dialogues[currentDialogueIndex].line.Length;
            audioSource.Stop();
        }
        else
        {
            // Proceed to the next dialogue
            currentDialogueIndex++;
            PlayDialogue();
        }
    }

    private void ShowChoices()
    {
        bottomPanel.SetActive(false);
        clickInterceptorPanel.SetActive(false);
        choicePanel.SetActive(true);

        foreach (Transform child in choicePanel.transform)
        {
            Destroy(child.gameObject);
        }

        for (int i = 0; i < currentAct.choices.Length; i++)
        {
            GameObject choiceInstance = Instantiate(choicePrefab, choicePanel.transform);
            ChoiceScript choiceScript = choiceInstance.GetComponent<ChoiceScript>();
            choiceScript.Init(i, currentAct.choices[i]);
        }

        state = State.Choice;
    }

    public void ClickChoice(int index)
    {
        GenerateAct(index);
    }
}