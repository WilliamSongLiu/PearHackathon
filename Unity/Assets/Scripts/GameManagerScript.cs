using UnityEngine;
using TMPro;

public class GameManagerScript : MonoBehaviour
{
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
		StartCoroutine(NetworkManagerScript.Instance.SendRequest(
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
		StartCoroutine(NetworkManagerScript.Instance.SendRequest(
			$"/generate-scene", GenerateSceneReceived));
	}
	class GenerateSceneResponse
	{
		public bool success;
	}
	void GenerateSceneReceived(string response)
	{
		GenerateSceneResponse json = JsonUtility.FromJson<GenerateSceneResponse>(response);
		if (!json.success)
		{
			Debug.LogError("Error: !json.success");
			return;
		}

		loadingPanel.SetActive(false);
	}
}
