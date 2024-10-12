using System;
using System.Collections;
using UnityEditor.Search;
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

	public IEnumerator RequestJSON(string query, Action<string> callback)
	{
		string requestUrl = $"{baseUrl}{query}";
		UnityWebRequest request = UnityWebRequest.Get(requestUrl);
		yield return request.SendWebRequest();

		if (request.result != UnityWebRequest.Result.Success)
		{
			Debug.LogError($"Request JSON {query} error: {request.error}");
			yield break;
		}

		string json = request.downloadHandler.text;
		callback(json);
	}

	public IEnumerator RequestImage(string file, Action<Sprite> callback)
	{
		string requestUrl = $"{baseUrl}/image?file={file}";
		UnityWebRequest request = UnityWebRequestTexture.GetTexture(requestUrl);
		yield return request.SendWebRequest();

		if (request.result != UnityWebRequest.Result.Success)
		{
			Debug.LogError($"Request image {file} error: {request.error}");
			yield break;
		}

		Texture2D texture = DownloadHandlerTexture.GetContent(request);
		Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
		callback(sprite);
	}

	public IEnumerator RequestAudio(string file, Action<AudioClip> callback)
	{
		string requestUrl = $"{baseUrl}/audio?file={file}";
		UnityWebRequest request = UnityWebRequestMultimedia.GetAudioClip(requestUrl, AudioType.MPEG);
		yield return request.SendWebRequest();

		if (request.result != UnityWebRequest.Result.Success)
		{
			Debug.LogError($"Request audio {file} error: {request.error}");
			yield break;
		}

		AudioClip audioClip = DownloadHandlerAudioClip.GetContent(request);
		callback(audioClip);
	}
}
