/**
* 处理 外站h5 native 跳转
**/
import Mtop from '../../mtop';
import mobile from './mobile';
import config from '../../original/military/config';
import getParams from './getParams';
import UA from './browser';
import callApp from './callApp';

const urlParam = getParams();
const baseUrl = 'https://hudong.vip.youku.com/act/mili/index.html';
let url = '';

function goPage(url){
	let ykconfig =  {
	  isNeedDownload: false,//是否需要下载页
	  downloadUrl:'',//下载页地址，不传默认走download.html
	  uri: '', //是否跳转h5页面
	  replace: false, //是否替换当前页面,只支持跳转uri的时候
	  params: {
	      "action":"http", //必须传（支持play,download,http,splash）
	      "vid":'',//唤起播放页必须传
	      "source": '', //可不传
	      "url": url
	  },
	  pathname:"http",//必须传 与 params.action一致
	  exdParams: {//透传到下载页的参数
	      position:"",
	      uriDownload:""
	  }
	};
  if(UA.isYouku){
  	location.replace(url);
  }else{
  	callApp.gotoPage(ykconfig);
  }
}

export default {
  setToken(params, callback) {
      const defaultParams = {
          mtopDomain: config.mtopDomain,
          appKey: config.appKey,
          api: 'com.youku.aplatform.weakGet',
          ecode: 0,
          bizType: 'aacc.socialPageInfo',
          bizParam: {
              token: urlParam.token,
              cid: urlParam.cid
          },
      };

      const newOpts = Object.assign(defaultParams, params);
      Mtop.getMtopinfo(newOpts).then((res) => {
          if (res.data.success) {
              const token = res.data.result.token;
              this.token = token || '';
              if (!this.token) {
                this.__btn.style.display = 'none';
              }
              let type = urlParam.type || 'social_youku';
              if (newOpts.bizParam.channel) {
                type = newOpts.bizParam.channel;
              }
              url = baseUrl + '?type=' + type + '&token=' + this.token;
              if (window.WindVane) {
                url += '&isWindVane=1';
              }
              if (typeof callback === 'function') {
                  callback(token);
              }
          }
      });
  },

  linkBtn(domSelector, needToken = true, params, clickHandle) {
      const $btn = document.querySelector(domSelector);
      this.__btn = $btn;
      this.needToken = needToken;
      if (!this.token && typeof needToken !== 'string') {
         this.setToken(params);
      }
      const self = this;
      if ($btn) {
          $btn.addEventListener('click',(e) => {
              e.preventDefault();
              if (typeof clickHandle === 'function') {
                clickHandle();
              }
              if (needToken === 'api') {
                  return this.setToken(params, () => {
                      this.__goUrl();
                  });
              }
              if(needToken && !this.token) {
                  return false;
              }
              this.__goUrl();
          }, false)
      }
  },
  __goUrl() {
    if (this.needToken === 'api') {
      mobile.openUrl({
         url,
      });
    } else {
      goPage(url);
    }
};
