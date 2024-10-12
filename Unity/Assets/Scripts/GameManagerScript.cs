using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameManagerScript : MonoBehaviour
{
    [SerializeField] TMP_Text bottomText;
    [SerializeField] GameObject loadingPanel;

	private void Start()
    {
        loadingPanel.SetActive(true);

        bottomText.text = $"Your name is {DataManager.playerName} and your genre is {DataManager.genre}";
	}
}
