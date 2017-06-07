import Browser from './browser'
const userAgent = navigator.userAgent.toLowerCase();

class APP {
	constructor(option = {}){
		this._self = null;
		this._shade = null;
		this._parent = option.el || $(document.body);
		this._shadeClose = typeof option.shadeClose == 'undefined'?true:option.shadeClose;
		this._callback = option.callback || null;
		this.init();
	}

	init(){
		if(Browser.isYouku){
			let appUaStar = userAgent.substr(userAgent.indexOf('youku'));
			if(Browser.android){
				var versions = appUaStar.substr(0,appUaStar.indexOf(')')).split('/')[1]
			}else if(Browser.iOS){
				var versions = appUaStar.substr(0,appUaStar.indexOf('(')).split('/')[1]
			}
			let verArr = versions.split('.'),
				verNum = verArr[0]+verArr[1]+verArr[2];
			if(verNum < 100 ){
				this.render();
			}
		}
	}

	render(){
		let __tpl = `
			<div class="dialog">
				<div class="dialog-content">
						<div class="toast bounceIn">
							<div class="clz"></div>
							<div class="toastCont">
								<span class="txt">优酷版本太低，更新app</span>
								<span class="note"><em class="upApp">确定</em></span>
							</div>
						</div>
				</div>
				<div class="shade"></div>
			</div>
		`;
		this._self = $(__tpl);
		this.setSty();
		this.bind();
		this._parent.append(this._self);
	}

	setSty(){
	
		this._content = $('.dialog-content', this._self).css({
			"position": "fixed",
			"left":'50%',
			"top":'50%',
			"-webkit-transform":"translate(-50%,-50%)",
			"transform":"translate(-50%,-50%)",
			"margin": "0 auto",
			"z-index": 100
		});
		this._shade = $('.shade', this._self).css({
			"position":"fixed",
			"width":"100%",
			"height":"100%",
			"background":"rgba(0,0,0,0.9)",
			"left":0,
			"top":0,
			"z-index":99
		})

	}
	bind(){
		let me = this;
		if(this._shadeClose){
			this._shade.on('click', function(){
				me.close();
			})
		}
		this._self.on('click','.clz,.upApp',function(){
			me.close();
		})

		this._self.on('touchmove', function(e){
			e.preventDefault();
			return false;
		});
		this._callback&&this._callback.call(this, this._self);
	}

	close(){
		this._self.remove();
	}
}

module.exports = APP;