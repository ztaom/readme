/*页面连接跳转*/
import mobile from './mobile'
import goldlog from './goldlog'
var navigator = require('@ali/orbit-navigator');

module.exports = {
	init(){
		this.main = $('.main');
		this._bind();
	},
	_bind(){
		this.main.on('click', '[data-link]', $.proxy(this.loadUrl, this));
		this.main.on('click', '[data-planetId]', $.proxy(this.loadPlanet, this));
	},
	loadUrl(e){
		var target = $(e.currentTarget),
			parmas = target.data('link'),
			Arr = parmas.split(';'),
			md = target.data('md');

		goldlog('military',md,'CLK');

		if(Arr.length > 1){
			mobile.play({
				url:Arr[0],
				vid:Arr[1],
			})
		}else{
			mobile.openUrl({
				url:parmas
			})
		}
		return false;
	},
	loadPlanet(e){
		var target = $(e.currentTarget),
			id = target.data('planetid'),
			fansArr = target.data('fans').split('/'),
			fansApp = fansArr[0],
			fansH5 = fansArr[1];
		navigator.navigate({
			target : 'youku://planet/'+fansApp+'?id='+id,
			fallback : this.getH5Base('pre') + fansH5 + '/'+id,
			vi : '6.6.2.1',
			va : '6.6.3.3'
		});
	},
	getH5Base(env){
	  if (env === 'dev'){
	    return 'http://dev.m.planet.youku.com/';
	  } else if (env === 'pre'){
	    return 'http://pre.m.planet.youku.com/';
	  } else {
	    return 'https://m.planet.youku.com/';
	  }
	}
}
