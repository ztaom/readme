/**
* dialog
* option el:父元素 elm object | w:宽 string | h:高 string | tpl:模版 string 
* shadeClose:是否点击遮罩关闭弹窗 boolean | callback fn  
**/
class Dialog {
	constructor(option = {}){
		this._self = null;
		this._shade = null;
		this._parent = option.el || $(document.body);
		this._w = option.w || '100%';
		this._h = option.h || '';
		this._tpl = option.tpl || '';
		this._data = option.data || null;
		this._shadeClose = typeof option.shadeClose == 'undefined'?true:option.shadeClose;
		this._callback = option.callback || null;
		this.init();
	}

	init(){
		this.render(this._tpl, this._data);
	}

	render(_tpl, data){
		let __tpl = `
			<div class="dialog">
				<div class="dialog-content">
					${_tpl}
				</div>
				<div class="shade"></div>
			</div>
		`;
		this._self = $(__tpl);
		this.setSty();
		this.bind();
		this._parent.append(this._self);
		this.setPosition();
	}

	setSty(){
	
		this._content = $('.dialog-content', this._self).css({
			"width" : this._w,
			"height": this._h,
			"position": "fixed",
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

	setPosition(){
		let viewHeight = $(window).height(),
		viewWidth = $(window).width(),
		selfHeight = this._content.height(),
		selfWidth = this._content.width();
		this._content.css({
			'top':(viewHeight-selfHeight)/2 + 'px',
			'left':(viewWidth-selfWidth)/2 + 'px'
		})

	}

	bind(){
		let me = this;
		if(this._shadeClose){
			this._shade.on('click', function(){
				me.close();
			})
		}
		
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

module.exports = Dialog;