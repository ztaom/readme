## 异步加载图片
```bash 
var loadImg = function (url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            resolve()  ;
        };
        img.onerror = function () {
            reject()  ;
        };
    });
};

Promise.all([
    loadImg('xxx.jpg'),
    loadImg('yyy.jpg'),
    loadImg('zzz.jpg'),
]).then(function () {
    alert('all images are loaded!')
});

```  
