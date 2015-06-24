
using UnityEngine;
using System.Collections;
using System.IO;

public class DownLoad : MonoBehaviour {
	//保存的文件路径;
	string savePath;
	string content;
	public bool isDownLoading = false;
	public bool noSuchFile = false;
	// Use this for initialization;

	void Start () {
		Debuger.EnableLog = true;
		//保存路径;
		savePath = Application.dataPath + "/Resources/";
		// getContent("gq/gt/originText.strip");
		getContent("originText.txt");
		// Directory.CreateDirectory(savePath+ "tt/dd");
	}
	// Update is called once per frame;

	void Update () {
	}

	public string getContent(string name) {

		if (!isDownLoading) {
			StartCoroutine(loadRefresh(name));
			return content;
		}
		return "";
	}

	IEnumerator loadRefresh(string name) {
		string url = "http://5alamander.github.io/WebResources/" + name;
		noSuchFile = false;
		isDownLoading = true;
		WWW www = new WWW(url);
		yield return www;
		//可以下载;

		if (string.IsNullOrEmpty (www.error)) {
			Debuger.Log("DownLoad..");
			string str = www.text;
			string folder = getFolder(name);

			if (folder != null) {
				Directory.CreateDirectory(savePath + folder);
			}
			File.WriteAllText(savePath + name, str);
			Debuger.Log("Saved..");
			content = str;
		}

		else {
			StartCoroutine(loadLocal(name));
		}
		//释放资源;
		www.Dispose();
		isDownLoading = false;
		return false;
	}

	IEnumerator loadLocal(string name) {
		WWW www = new WWW("file://" + savePath + name);
		Debuger.Log("LocalLoad..");
		yield return www;

		if (string.IsNullOrEmpty (www.error)) {
			content = www.text;
			Debuger.Log("output..");
		}

		else {
			noSuchFile = true;
			Debuger.Log("no Such File..");
		}
	}

	string getFolder(string path) {
		int index = path.LastIndexOf("/");

		if (index > 0) {
			return path.Substring(0, index);
		}

		else {
			return "";
		}
	}
}