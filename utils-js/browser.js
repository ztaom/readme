const userAgent = navigator.userAgent.toLowerCase();

const browserUA = {
	isIE: /Trident/.test(userAgent),
	//语言特性
	lang: (navigator.language || navigator.systemLanguage).toLowerCase(),
	// iOS
	iOS: /(ipad|iphone|ipod)/i.test(userAgent),
	// iPad
	isIPad: /ipad/i.test(userAgent),
	
	iOSVersion: (userAgent.match(/os\s+([\d_]+)\s+like\s+mac\s+os/) || [0,'0_0_0'])[1].split('_'),
	// windows phone
	wphone: parseFloat((userAgent.match(/windows\sphone\s(?:os\s)?([\d.]+)/) || ['','0'])[1]),
	// android
	android: parseFloat((userAgent.match(/android[\s|\/]([\d.]+)/) || ['','0'])[1]),
	// QQ
	isQQ: /qq\/\d+\.\d/i.test(userAgent),
	// wechat
	isWechat: /micromessenger/i.test(userAgent),
	// 搜狗浏览器
	isSogou: /sogou/i.test(userAgent),
	// 猎豹浏览器
	isLieBao: /liebao/i.test(userAgent),
	// 遨游浏览器
	isMaxthon: /mxbrowser/i.test(userAgent),
	// UC浏览器
	isUC: /ucbrowser/i.test(userAgent),
	// 优酷客户端
	isYouku: /youku/i.test(userAgent),
	// 优酷主版本
	youkuMainVersion: userAgent.replace(/.*youku\/([0-9]+).*/i, '$1'),
	// 优酷子版本
	youkuSubVersion: userAgent.replace(/.*youku\/[^.]+\.([0-9]+).*/i, '$1'),
	// 优酷pad版
	isYoukuHD: /youku_hd/i.test(userAgent),
	// 支付宝
	isAlipay: /alipayclient/i.test(userAgent),
	// 微博
	isWeiBo: /weibo/i.test(userAgent),
	// 钉钉
	isDingDing: /dingtalk/i.test(userAgent),
	//判断华为5.0
	isHuaWei:/huawei/i.test(userAgent),
	// 判断是否含windvane
	isWindvane: /windvane/i.test(userAgent)
};

// 检测UA及设备陀螺仪旋转值判断是否为移动设备
browserUA.isMobile = !!browserUA.iOS || !!browserUA.wphone || !!browserUA.android || (window.orientation !== undefined) || false;
// 检测移动设备是否为平板
browserUA.isPad = browserUA.isMobile && (browserUA.isIPad || browserUA.isYoukuHD || userAgent.indexOf('mobile') == -1 || (userAgent.indexOf('windows nt') != -1 && userAgent.indexOf('touch') != -1)) || false;
// 检测移动设备是否为手机
browserUA.isPhone = browserUA.isMobile && !browserUA.isPad;
// 是否是安卓
browserUA.isAndroid = browserUA.android;

module.exports = browserUA;