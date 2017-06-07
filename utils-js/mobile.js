/* 针对mobile公共能力封装 */
import Browser from './browser'
import URL from './url'
import Bridge from '../bridge'
import Cookie from './cookie'

module.exports = {
	/**
	 * 显示登录框
	 * opts.callbackUrl, H5登录的callbackUrl，默认为location.href
	 * 其余参数参考Bridge
	 */
	showLogin: function(opts = {}){
		if(Browser.isYouku){
			Bridge.showLogin(opts);
		}else{
			var callbackUrl = opts.callbackUrl || window.location.href;
			window.location.href = "https:/account.youku.com?callback=" + encodeURIComponent(callbackUrl);
		}
	},

	/**
	 * 播放
	 * url H5播放url
	 * target H5播放的target 默认打开新页面
	 * 其他参数 参考bridge
	 */
	play: function(opts = {}){
		if(Browser.isYouku){
			Bridge.play(opts);
		}else{
			URL.openURL(opts.url, opts.target || '_blank');
		}
	},

	/**
	 * 加载url
	 * target H5打开新页面的target
	 */
	openUrl: function(opts = {}){
		if(Browser.isYouku){
			Bridge.loadUrl(opts);
		}else{
			URL.openURL(opts.url, opts.target || '_self');
		}
	},

	/**
	 * 关闭当前页面
	 * target H5打开新页面的target
	 */
	close(){
		if(Browser.isYouku){
			Bridge.close();
		}else{
        	window.close();
		}
	}
}
