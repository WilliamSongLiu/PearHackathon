using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class SetupManagerScript : MonoBehaviour
{
    [SerializeField] TMP_Text questionText;
    [SerializeField] TMP_InputField answerInputField;
    [SerializeField] GameObject genresPanel;

    enum Stage
    {
        Name,
        Genre,
        CustomGenre
    }
    Stage stage;

	private void Start()
    {
        stage = Stage.Name;

        questionText.text = "What is your name?";

        answerInputField.gameObject.SetActive(true);
        genresPanel.SetActive(false);
	}

    public void SubmitAnswerInputField()
    {
        if (answerInputField.text == "")
        {
            return;
        }

        if (stage == Stage.Name)
        {
			DataManager.playerName = answerInputField.text;

			stage = Stage.Genre;

			questionText.text = "What genre would you like your story to be?";

			answerInputField.gameObject.SetActive(false);
			genresPanel.SetActive(true);
		}
        else if (stage == Stage.CustomGenre)
        {
			DataManager.genre = answerInputField.text;

			SceneManager.LoadScene("Game");
		}
	}

    public void SelectGenreButton(string genre)
    {
        DataManager.genre = genre;

        if (genre == "custom")
        {
            stage = Stage.CustomGenre;

            answerInputField.text = "";

			answerInputField.gameObject.SetActive(true);
			genresPanel.SetActive(false);
		}
        else
        {
            SceneManager.LoadScene("Game");
        }
    }
}
