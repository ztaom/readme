//tab  eq
// let  tab = new Tab({
// 	'items':$('.tabTitle li'),
// 	'details':$('.tabContent .detail'),
//  'method':'click'
// 	'callback': function(index, currntItem){
// 		if(index == 3){
// 			alert(999);
// 			return false;
// 		}
// 	}
// });

class Tab{
	constructor(option={}){
		this._items  = option.items;
		this._itemDetails = option.details;
		this._method = option.method || 'click';
		this._current = option.current || 0;
		this._callback = option.callback;
		this.init();
	}

	init(){
		this.bind();
		this.go(this._current);
	}

	bind(){
		let me = this;
		this._items.each(function(i,j){
			$(j).on(me._method, function(){
				let self = $(this),
				_index = $(this).index();
				let status = me._callback&&me._callback.apply(null, [_index, self])
				if(typeof status == 'undefined'){
					me._items.removeClass('active');
					self.addClass('active')
					me._itemDetails.hide();
					me._itemDetails.eq(_index).show()
				}
			})
		})
	}

	go(index){
		this._items.eq(index).trigger(this._method);
	}
}

module.exports = Tab;