//判断是否登录
import Cookie from './cookie'

function loginInfo(){
	var P_sck = Cookie.get('P_gck');
	var yktk = Cookie.get('yktk');
	if (!!P_sck || !!yktk) {
		//已登录
		return true;
	} else {
		//未登录
		return false;
	}
}

export default loginInfo