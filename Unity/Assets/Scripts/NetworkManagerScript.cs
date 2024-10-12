using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class NetworkManagerScript : MonoBehaviour
{
	string url = "http://localhost:3000/";

	private void Start()
	{
		StartCoroutine(SendRequest(""));
	}

	IEnumerator SendRequest(string query)
	{
		using (UnityWebRequest webRequest = UnityWebRequest.Get($"{url}{query}"))
		{
			yield return webRequest.SendWebRequest();

			if (webRequest.result == UnityWebRequest.Result.ConnectionError ||
				webRequest.result == UnityWebRequest.Result.ProtocolError)
			{
				Debug.LogError("Error: " + webRequest.error);
			}
			else
			{
				string jsonResponse = webRequest.downloadHandler.text;
				Debug.Log("Response: " + jsonResponse);

				MyData data = JsonUtility.FromJson<MyData>(jsonResponse);

				Debug.Log("Parsed Data: " + data.test);
			}
		}
	}

	[System.Serializable]
	public class MyData
	{
		public string test;
	}
}
