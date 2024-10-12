using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ChiocesManagerScript : MonoBehaviour
{
    [SerializeField] TMP_Text questionText;
    [SerializeField] TMP_InputField answerInputField;
    [SerializeField] GameObject genrePanel;

    void Start()
    {
        questionText.text = "What is your name?";

        answerInputField.gameObject.SetActive(true);
        genrePanel.SetActive(false);
	}

    public void SubmitAnswerInputField()
    {
        DataManager.playerName = answerInputField.text;

		answerInputField.gameObject.SetActive(false);
		genrePanel.SetActive(true);
	}

    public void SelectGenreButton(string genre)
    {
        DataManager.genre = genre;
    }
}
