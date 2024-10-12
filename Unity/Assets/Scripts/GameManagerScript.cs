using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameManagerScript : MonoBehaviour
{
	[SerializeField] Image backgroundImage;
    [SerializeField] TMP_Text bottomText;
    [SerializeField] GameObject loadingPanel;
	[SerializeField] TMP_Text loadingText;

	private void Start()
    {
		loadingText.text = "Building the world...";
		loadingPanel.SetActive(true);

        SetupStory();
	}

	void SetupStory()
	{
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

		GenerateScene();
	}

	void GenerateScene()
	{
		StartCoroutine(NetworkManagerScript.Instance.RequestJSON(
			$"/generate-scene", GenerateSceneReceived));
	}
	class GenerateSceneResponse
	{
		public bool success;
		public string backgroundImageFile;
	}
	void GenerateSceneReceived(string response)
	{
		GenerateSceneResponse json = JsonUtility.FromJson<GenerateSceneResponse>(response);
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

		loadingPanel.SetActive(false);
	}
}
