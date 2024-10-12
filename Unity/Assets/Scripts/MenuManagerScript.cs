using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuManagerScript : MonoBehaviour
{
    public void Play()
    {
        SceneManager.LoadScene("Choices");
    }
}
