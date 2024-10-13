using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ChoiceScript : MonoBehaviour
{
    Button button;

	[SerializeField] TMP_Text buttonText;

	private void Awake()
	{
		button = GetComponent<Button>();
	}

	public void Init(int index, string text)
	{
		buttonText.text = text;

		button.onClick.AddListener(() => GameManagerScript.Instance.ClickChoice(index));
	}
}
