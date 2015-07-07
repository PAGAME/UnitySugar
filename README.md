# UnitySugar
##Just for fun
---
##简介
人生苦短，
为了提高点效率，
做了一个艰难的决定，
用电脑的时间换人脑的时间。

---
##声明
++i的效率比i++快，
但是和我有什么关系呢。╮(￣▽￣")╭ 

---

Find odd, and set color
```csharp
for (int i = 0; i < transform.childCount; i += 2) {
    Transform child = transform.GetChild(i);
    Renderer r = child.GetComponent<Renderer>();
    if (r != null) {
        r.sharedMaterial.color = Color.red;
    }
}
```

use LINQ instead
```csharp
Enumerable
    .Range(0, transform.childCount)
    .Where(n => n % 2 == 0)
    .Select(n => transform.GetChild(n).GetComponent<Renderer>())
    .OfType<Renderer>()
    .Select(r => r.sharedMaterial.color = Color.red);
```

use UnityQuery instaed
```csharp
UQ(transform)
    .Children()
    .Even()
    .ForEach<Renderer>(r => r.sharedMaterial.color = Color.red);
```