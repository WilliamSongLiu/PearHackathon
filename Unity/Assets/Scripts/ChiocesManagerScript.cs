using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class ChiocesManagerScript : MonoBehaviour
{
    [SerializeField] TMP_Text questionText;
    [SerializeField] TMP_InputField answerInputField;
    [SerializeField] GameObject genresPanel;

    // 0 is name, 1 is genre, 2 is custom genre
    int stage;

    void Start()
    {
        stage = 0;

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

        if (stage == 0)
        {
			DataManager.playerName = answerInputField.text;

			stage = 1;

			questionText.text = "What genre would you like your story to be?";

			answerInputField.gameObject.SetActive(false);
			genresPanel.SetActive(true);
		}
        else if (stage == 2)
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
            stage = 2;

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
