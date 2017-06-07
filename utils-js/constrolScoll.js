/* H5禁止/取消页面滚动 */
module.exports = {
	enableScroll(){
		 window.addEventListener('touchmove', this.windowNoScroll, false);
	},
	canScroll(){
		window.removeEventListener('touchmove', this.windowNoScroll, false);
	},
	windowNoScroll(e){
		e.preventDefault();
		return false;
	}
}