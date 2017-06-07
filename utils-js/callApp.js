import HttpURL from '@ali/lib-httpurl';
import * as env from 'amfe-env';
import extend from 'xtend';

const doc = window.document;
const ua = window.navigator.userAgent;
const os = env.os;
const params = env.params;
const browser = env.browser;

const DEFAULT_TIMEOUT = env.os.isIOS ? 2500 : 1000;

const SB = /MQQBrowser|micromessenger|QQ/i.test(navigator.userAgent);
const youkuapp = /youku/i.test(ua);
const weixin = /microMessenger/i.test(ua);
const weibo = /weibo/i.test(ua);
const uc = /ucbrowser/i.test(ua);

const packageEnum = "com.youku.phone";

const schemeEnum = /iPad/.test(navigator.userAgent) ? 'youkuhd://' : 'youku://';

const universalLink = "http://link-jump.youku.com/a/";

const yingyongbaoLink = "http://a.app.qq.com/o/simple.jsp?pkgname=com.youku.phone";

const logUrl = "//statis.api.3g.youku.com/openapi-wireless/statis/recall_app_service";

const downloadUrlEnum = {
    "YK": "//m.youku.com/html/download.html"
};

const UUID = {
    chars: "0123456789abcdefghijklmnopqrstuvwxyz",
    uuid: function(n) {
        let f = this.chars.length, chars = [];
        for(let i = 0; i < n; i++) {
            chars.push(this.chars[parseInt(Math.random() * f)])
        }
        return chars.join("");
    }
};
//是否UniversalLink唤起
let inUniversalLink = false;

const callApp = {
    /**
     * 唤起客户端并打开某个页面/功能
     * @method
     * @param {Object} [options] - 配置参数
     * @param {String} [options.package] - Android下客户端的包名称
     * @param {String} [options.params={}] - 拼装在协议上的参数
     * @memberof callApp
     */
    gotoApp: function( options = {}){

        const cid = getCookie('__ysuid');
        options.pathname = options.pathname?options.pathname:"splash";
        options.params.action = options.params.action?options.params.action:"";
        options.params.ua = ua;
        options.params.refer = params["refer"]?params["refer"]:(params["from"]?params["from"]:options.params.refer);
        options.params.ccts = new Date().getTime();
        options.params.cookieid = cid ? cid + '|' + UUID.uuid(6):"";
        options.params.tuid =  params["tuid"]?params["tuid"]:options.params.tuid;
        /*
         * 1.  小于4.5版本安卓手机的chrome非 webview 中，? 使用 intent 协议,并配置url.hash = 'Intent;scheme=' + url.protocol + ';package=' + (options['package'] || packageMap[url.protocol])+';end';
         * 2.  在非apad的手淘里 或 安卓 chrome 浏览器里，直接location跳转;否则通过 iframe 跳转
         * 3.  在ios>=9的safari里, iframe方式不被支持了,改用创建click点击事件的方式。
         * */

        let url = new HttpURL(schemeEnum+options.pathname);

        url.pathname="";

        if (options.params) {
            //加入options进入的参数
            appendParam(url, options.params);
        }
        //校验undefined参数
        urlParamsHint(url);

        //这里使用 lt 是因为不确定>=4.5的版本是否能够正确拉起
        //intent协议资料参考https://developer.chrome.com/multidevice/android/intents
        // 标准Android Chrome浏览器（包括Android原生的Chrome浏览器）需要用intent协议
        const isOriginalChrome = os.isAndroid && browser.isChrome && !browser.isWebview;
        const fixUgly =
            // 三星4.3/4.4的一些机型，原生浏览器需要intent协议
            os.isAndroid && !!ua.match(/samsung/i) && os.version.gte('4.3') && os.version.lt('4.5');
        const ios9SafariFix =
            // ios 9.0，需要用a标签的href???
            os.isIPhone && os.version.gte('9.0') && browser.isSafari;

        if (isOriginalChrome || fixUgly || !!options.forceIntent) {
            // 在系统原生的chrome里，用intent协议
            //#Intent;scheme=youku;package=com.youku.phone;end;
            url.hash = 'Intent;scheme=' + url.protocol.replace(':', '') + ';package=' + packageEnum +';end';
            url.protocol = 'intent:';
        }

        //ios9以上
        const ios9Up = os.isIPhone && os.version.gte('9.0');

        if(ios9Up){
            options.params.universalLinkState = true;
        }

        Log.track(options.params);

        if(weixin&&!os.isIPhone){//安卓微信特殊处理，走应用宝
            setTimeout(function(){//android_schema android_schema
                setLocation(`${yingyongbaoLink}&android_schema=${encodeURIComponent(url.toString())}`);
            }, 100);
        }else if(ios9Up){//ios9上 微信特殊处理，三四线UniversalLink，并同步走应用宝
            useUniversalLink(options);
            if(weixin){
                setTimeout(function(){
                    setLocation(`${yingyongbaoLink}&android_schema=${encodeURIComponent(url.toString())}`);
                }, 100);
            }
        } else if (url.protocol === 'intent:') { //用intent协议时，也直接location跳转
            setTimeout(function(){
                setLocation(url.toString());
            }, 100);
        } else{
            //注：在 iframe 中无法使用 intent 协议
            callInIframe(url.toString());
        }


        return url.toString();
    },
    /**
     * 下载apk或跳转到AppStore
     * @method
     * @param {Object} [options] - 配置参数
     * @param {String} [options.downloadUrl] - apk或AppStore的地址或是下载引导页
     * @param {Boolean} [options.replace=false] - 是否替换当前地址
     * @param {Boolean} [options.exdParams] - 是否透出当前页面的参数或者扩展参数到下载页
     * @memberof callApp
     */
    download: function( options = {}){

        if (!options.downloadUrl) {
            options.downloadUrl = downloadUrlEnum["YK"];
        }
        let url = new HttpURL(options.downloadUrl);

        if (options.exdParams) {
            appendParam(url, options.exdParams);
        }

        urlParamsHint(url);

        url = url.toString();

        setLocation(url, options.replace);

    },
    /**
     * 唤起客户端并打开某个页面/功能, 如果未安装app则根据配置引导下载页或h5
     * @method
     * @param {Object} [options] - 配置参数
     * @param {String} [options.isNeedDownload=false] - 没有成功唤起的情况下,是否执行下载逻辑
     * @param {String} [options.uri] - 跳h5时对应的页面
     * @param {String} [options.package] - Android下客户端的包名称
     * @param {String} [options.downloadUrl] - apk或AppStore的地址或是下载引导页
     * @param {Boolean} [options.replace=false] - 是否替换当前地址
     * @param {String} [options.timeout=2000 | 1000] - 跳h5或下载的延迟时间
     * @param {String} [options.params] - 拼装在协议上的参数
     * @param {String} [options.exdParams] - 是否透出当前页面的参数或者扩展参数到下载页
     * @memberof callApp
     */
    gotoPage: function( options = {}){

        options = extend({timeout: DEFAULT_TIMEOUT}, options);

        options.targetUrl = callApp.gotoApp(options);

        //针对UniversalLink唤起，不进行跳转下载页逻辑
        if(inUniversalLink)return options.targetUrl;

        //alert(options.timeout)
        // 跳下载
        if(options.isNeedDownload){
            let timer = window.setTimeout(function(){
                clearTimeout(timer);

                callApp.download(options);
            }, options.timeout);

        // 跳h5页面
        }else if(options.uri){
            let timer = window.setTimeout(function(){
                clearTimeout(timer);

                setLocation(options.uri, options.replace);
            }, options.timeout);
        }

        return options.targetUrl;
    }
};


// 唤起日志上报
//http://wiki.1verge.net/wireless:stat:h5%E6%8D%A2%E8%B5%B7app
const Log = {
    track: function(params = {}){
        const data = extend(params,{
            pagetype: 1,
            special: params.universalLinkState?1:0,
            datetime: parseInt(new Date().getTime() / 1000),
            sender: 1,
            pid: env.os.isIOS ? "69b81504767483cf" : "0d7c3ff41d42fcd9"
        })
        LogbackUp.backup(data);
        this.send(data);
    },
    send: function(params = {}){
        let url = new HttpURL(logUrl);

        appendParam(url, params);

        url = url.toString();

        new Image().src = url;
        // argument = 'pid='+pid+'&source='+source+'&ua='+ua+'&datetime='+datetime+'&refer='+refer+'&cookieid='+cookieid+cookiePlus+'&tuid='+tuid+'&pagetype=1&special=0&sender=1';
    }
};
const LogbackUp = {
    key: "_h5_app_launcher_track_key",
    restore: function() {
        const d = localStorage.getItem(this.key);
        return JSON.parse(d || '[]');
    },
    backup: function(params = {}) {
        const d = this.restore();
        d.push(params);
        localStorage.setItem(this.key, JSON.stringify(d));
    },
    resend: function() {
        const d = this.restore();
        this.clear();
        if(d){
            Log.send(d);
        }
    },
    clear: function() {
        localStorage.removeItem(this.key);
    }
};
//重发日志
LogbackUp.resend();

// 附近当前URL中的参数（透传）以及额外的参数
function appendParam(url, extraParam) {
    const currentUrl = new HttpURL(location.href);

    // 当前页面href中的参数透传，优先级低于已有的参数
    for (let key in currentUrl.params) {
        if (!url.params.hasOwnProperty(key)) {
            url.params[key] = currentUrl.params[key];
        }
    }

    // 额外的参数，优先级高于已有的参数
    if (typeof extraParam === 'object') {
        for (let key in extraParam) {
            // 将外来传入的数值型参数转成字符串 否则客户端会crash
            if(typeof extraParam[key] === 'number'){
                url.params[key] = '' + extraParam[key];
            }else if(typeof extraParam[key] === 'function'){
                url.params[key] = '';
            }else{
                url.params[key] = extraParam[key];
            }
        }
    }

    return url;
}

let iframe;
function callInIframe(url) {
    if (!iframe) {
        iframe = doc.createElement('iframe');
        iframe.id = 'callapp_iframe_' + Date.now();
        iframe.frameborder = '0';
        iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
        doc.body.appendChild(iframe);
    }
    iframe.src = url;
}

function setLocation(url, replace) {
    if ((replace !== false) && (replace === true)) {// undefined或true，且在app里或replace 为 true
        top.location.replace(url);
    } else {
        top.location.href = url;
    }
}

const UniversalLinkTracker = {
    key: '_h5_app_launcher_ios9_timestamp',
    save: function(){
        localStorage.setItem(this.key, new Date().getTime());
    },
    restore: function() {
        return parseInt(localStorage.getItem(this.key) || 0);
    },
    clear: function() {
        localStorage.removeItem(this.key);
    }

};

function useUniversalLink(options = {}){
    inUniversalLink = true;
    let params = options.params;
    const isAuto = /auto/i.test(params.source);
    //唤起失败的话，不进行自动唤起
    if(UniversalLinkTracker.restore()&&isAuto){
        UniversalLinkTracker.clear();
        return;
    }
    //针对外调自动唤起特殊逻辑，source匹配到auto不跳转到下载页
    if(isAuto){
        params.universalRedirect = window.location.href;
        UniversalLinkTracker.save();
    }
    let fb_url = params.universalRedirect?params.universalRedirect:(options.downloadUrl?options.downloadUrl:downloadUrlEnum["YK"]);
    fb_url = new HttpURL(fb_url);
    if (options.exdParams) {
        appendParam(fb_url, options.exdParams);
    }
    urlParamsHint(fb_url);
    fb_url = fb_url.toString();
    params.fallback_url = fb_url;
    params.fua = /Safari\/\d+(\.\d+)*$/.test(navigator.userAgent) ? "safari" : "other";
    params.special = 1;
    params.ts = new Date().getTime();
    params.action = params.action?params.action:"play";
    let url = new HttpURL(universalLink+options.pathname);
    appendParam(url, params);
    //校验undefined参数
    urlParamsHint(url);
    setLocation(url.toString());
}

function useAnchorLink(url) {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.style.display = 'none';
    document.body.appendChild(a);

    let e = document.createEvent('HTMLEvents');
    e.initEvent('click', false, false);
    a.dispatchEvent(e);
}

// 校验undefined参数
function urlParamsHint(url){
    if(url instanceof HttpURL) {
        for (let x in url._params) {
            if (url.params[x] === null || url.params[x] === "undefined" || url.params[x] === "") {
                delete url.params[x];
            }
        }
    }
}
//取得cookie
function getCookie(key) {
    const a = document.cookie.match(RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    return null != a ? unescape(a[2]) : null;
}
window.ykCallApp = callApp;
module.exports = callApp;
