/**
 * @public 跳到到指定地址，相对于open或location=，但是可以避免IE里location跳转时获取不到referrer的问题
 * @reference http://webbugtrack.blogspot.com/2008/11/bug-421-ie-fails-to-pass-http-referer.html
 * @TODO 会引起点击统计无法获得正确的位置编码
 */
function openURL(url, target){
	var a = document.createElement('a');
	a.setAttribute('href',url);
	a.setAttribute('target',(target||'_self'));
	document.body.appendChild(a);
	a.click();
}

exports.openURL = openURL;
