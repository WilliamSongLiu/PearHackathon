using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class NetworkManagerScript : MonoBehaviour
{
	public static NetworkManagerScript Instance { get; private set; }
	private void Awake()
	{
		if (Instance == null)
		{
			Instance = this;
		}
		else
		{
			Destroy(gameObject);
		}
	}

	string baseUrl = "http://localhost:3000";

	public IEnumerator SendRequest(string query, Action<string> callback)
	{
		string requestUrl = $"{baseUrl}{query}";
		using (UnityWebRequest webRequest = UnityWebRequest.Get(requestUrl))
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
			}
		}
	}
}
