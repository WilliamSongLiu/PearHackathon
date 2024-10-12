using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

[RequireComponent(typeof(AudioSource))]
public class GameManagerScript : MonoBehaviour
{
	AudioSource audioSource;

	[SerializeField] Image backgroundImage;
	[SerializeField] TMP_Text speakerText;
	[SerializeField] TMP_Text lineText;
    [SerializeField] GameObject loadingPanel;
	[SerializeField] TMP_Text loadingText;

	enum State
	{
		StorySetup,
		GeneratingAct,
		PlayingJustStarted,
		PlayingAnimating,
		PlayingDoneAnimating
	}
	State state;

	class Dialogue
	{
		public string speaker;
		public string line;
		public Dialogue(string _speaker, string _line)
		{
			speaker = _speaker;
			line = _line;
		}
	}
	class Act
	{
		public List<Dialogue> dialogues;
		public Act(List<Dialogue> _dialogues)
		{
			dialogues = _dialogues;
		}
	}
	Act act;
	int currentDialogueIndex;
	int currentDialogueCharacterIndex;

	float textInterval = 0.1f;
	float lastTextUpdate;

	private void Awake()
	{
		audioSource = GetComponent<AudioSource>();

		act = new Act(new List<Dialogue>() {
			new Dialogue("Bob", "You know, I always forget how nice it is to just sit here and relax. Life gets so hectic sometimes."),
			new Dialogue("Joe", "I know what you mean. It feels like we�re always rushing from one thing to the next. Last week was a blur for me.")
		});
	}

	private void Start()
    {
		loadingText.text = "Building the world...";
		loadingPanel.SetActive(true);

        SetupStory();
	}

	void SetupStory()
	{
		state = State.StorySetup;

		StartCoroutine(NetworkManagerScript.Instance.RequestJSON(
			$"/setup-story?genre={DataManager.genre}", SetupStoryReceived));
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

		GenerateAct();
	}

	void GenerateAct()
	{
		state = State.GeneratingAct;

		StartCoroutine(NetworkManagerScript.Instance.RequestJSON($"/generate-act", GenerateActReceived));
	}
	class GenerateActResponse
	{
		public bool success;
		public string backgroundImageFile;
	}
	void GenerateActReceived(string response)
	{
		GenerateActResponse json = JsonUtility.FromJson<GenerateActResponse>(response);
		if (!json.success)
		{
			Debug.LogError("Error: !json.success");
			return;
		}

		loadingText.text = "Loading...";

		StartCoroutine(NetworkManagerScript.Instance.RequestImage(json.backgroundImageFile, BackgroundImageReceived));
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
			speakerText.text = act.dialogues[currentDialogueIndex].speaker;
			lineText.text = "";

			loadingPanel.SetActive(false);

			state = State.PlayingAnimating;
			currentDialogueIndex = 0;
			currentDialogueCharacterIndex = 0;
			lastTextUpdate = 0f;

			GenerateVoice(act.dialogues[currentDialogueIndex].line);
		}
		else if (state == State.PlayingAnimating)
		{
			if (Time.time - lastTextUpdate >= textInterval)
			{
				currentDialogueCharacterIndex++;
				lineText.text = act.dialogues[currentDialogueIndex].line.Substring(0, currentDialogueCharacterIndex);

				if (currentDialogueCharacterIndex >= act.dialogues[currentDialogueIndex].line.Length)
				{
					state = State.PlayingDoneAnimating;
				}

				lastTextUpdate = Time.time;
			}
		}
	}

	void GenerateVoice(string line)
	{
		StartCoroutine(NetworkManagerScript.Instance.RequestJSON($"/generate-voice?line={line}", GenerateVoiceReceived));
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
	}
}
