using System.Collections.Generic;
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
		} else
		{
			Destroy(gameObject);
		}
	}

	AudioSource audioSource;

	[SerializeField] Image backgroundImage;
	[SerializeField] GameObject bottomPanel;
	[SerializeField] TMP_Text speakerText;
	[SerializeField] TMP_Text lineText;
	[SerializeField] GameObject clickInterceptorPanel;
	[SerializeField] GameObject choicePanel;
	[SerializeField] GameObject loadingPanel;
	[SerializeField] TMP_Text loadingText;

	[SerializeField] GameObject choicePrefab;

	enum State
	{
		StorySetup,
		GeneratingAct,
		PlayingJustStarted,
		PlayingWaitingForAudio,
		PlayingAnimating,
		PlayingDoneAnimating,
		Choice
	}
	State state;

	[System.Serializable]
	class Dialogue
	{
		public string speaker;
		public string line;
	}
	class Act
	{
		public string backgroundImageFile;
		public Dialogue[] dialogues;
		public string[] choices;
	}
	Act currentAct;
	int currentDialogueIndex;
	int currentDialogueCharacterIndex;

	float textInterval = 0.03f;
	float lastTextUpdate;

	private void Start()
    {
		audioSource = GetComponent<AudioSource>();

		loadingText.text = "Building the world...";
		loadingPanel.SetActive(true);

        SetupStory();
	}

	void SetupStory()
	{
		state = State.StorySetup;

		StartCoroutine(NetworkManagerScript.Instance.RequestJSON(
			$"/setup-story?genre={DataManager.genre}&playerName={DataManager.playerName}", SetupStoryReceived));
	}
	class SetupStoryResponse
	{
		public bool success;
	}
	void SetupStoryReceived(string response)
	{
		SetupStoryResponse json = JsonUtility.FromJson<SetupStoryResponse>(response);
		if (!json.success)
		{
			Debug.LogError("Error: !json.success");
			return;
		}

		loadingText.text = "Generating the story...";

		GenerateAct(-1);
	}

	void GenerateAct(int choiceIndex)
	{
		loadingText.text = "Loading next act...";
		loadingPanel.SetActive(true);

		state = State.GeneratingAct;

		StartCoroutine(NetworkManagerScript.Instance.RequestJSON($"/generate-act?choiceIndex={choiceIndex}", GenerateActReceived));
	}
	void GenerateActReceived(string response)
	{
		currentAct = JsonUtility.FromJson<Act>(response);

		loadingText.text = "Loading...";

		StartCoroutine(NetworkManagerScript.Instance.RequestImage(currentAct.backgroundImageFile, BackgroundImageReceived));
	}
	void BackgroundImageReceived(Sprite sprite)
	{
		backgroundImage.sprite = sprite;
		
		state = State.PlayingJustStarted;
	}

	private void Update()
	{
		if (state == State.PlayingJustStarted)
		{
			loadingPanel.SetActive(false);
			bottomPanel.SetActive(false);
			clickInterceptorPanel.SetActive(false);
			choicePanel.SetActive(false);

			state = State.PlayingWaitingForAudio;
			currentDialogueIndex = 0;

			GenerateVoice();
		}
		else if (state == State.PlayingAnimating)
		{
			if (Time.time - lastTextUpdate >= textInterval)
			{
				currentDialogueCharacterIndex++;
				lineText.text = currentAct.dialogues[currentDialogueIndex].line.Substring(0, currentDialogueCharacterIndex);

				if (currentDialogueCharacterIndex >= currentAct.dialogues[currentDialogueIndex].line.Length)
				{
					state = State.PlayingDoneAnimating;
				}

				lastTextUpdate = Time.time;
			}
		}
	}

	void GenerateVoice(string line)
	{
		StartCoroutine(NetworkManagerScript.Instance.RequestJSON($"/generate-voice?speaker={currentAct.dialogues[currentDialogueIndex].speaker}&line={currentAct.dialogues[currentDialogueIndex].line}", GenerateVoiceReceived));
	}
	class GenerateVoiceResponse
	{
		public bool success;
		public string voiceAudioFile;
	}
	void GenerateVoiceReceived(string response)
	{
		GenerateVoiceResponse json = JsonUtility.FromJson<GenerateVoiceResponse>(response);
		if (!json.success)
		{
			Debug.LogError("Error: !json.success");
			return;
		}

		StartCoroutine(NetworkManagerScript.Instance.RequestAudio(json.voiceAudioFile, VoiceReceived));
	}
	void VoiceReceived(AudioClip audioClip)
	{
		audioSource.Stop();
		audioSource.PlayOneShot(audioClip);

		bottomPanel.SetActive(true);
		clickInterceptorPanel.SetActive(true);

		state = State.PlayingAnimating;
		currentDialogueCharacterIndex = 0;
		lastTextUpdate = 0f;

		speakerText.text = currentAct.dialogues[currentDialogueIndex].speaker;
		lineText.text = "";
	}

	public void ClickInterceptorClicked()
	{
		if (state == State.PlayingAnimating)
		{
			state = State.PlayingDoneAnimating;
			lineText.text = currentAct.dialogues[currentDialogueIndex].line;

			audioSource.Stop();
		}
		else if (state == State.PlayingDoneAnimating)
		{
			currentDialogueIndex++;
			if (currentDialogueIndex >= currentAct.dialogues.Length)
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
			else
			{
				bottomPanel.SetActive(false);
				clickInterceptorPanel.SetActive(false);

				state = State.PlayingWaitingForAudio;

				GenerateVoice();
			}
		}
	}

	public void ClickChoice(int index)
	{
		GenerateAct(index);
	}
}
