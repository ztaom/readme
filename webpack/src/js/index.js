// if (process.env.NODE_ENV !== 'production') {
//   require('../../index.html')
// }
// import 'babel-polyfill' <script src="//g.alicdn.com/mtb/lib-promise/3.1.1/polyfillB.js"></script>
import 'babel-polyfill'
import mtop from '../../module/mtop'
require('../less/base.less')
require('../less/loading.less')


function callback(json){
    //console.log(json)
}

function getCards(){
        //获取卡
    let params = {
        api:'com.youku.aplatform.weakGet',
        ecode:0,
        bizType:'aacc.getCardInfo',
        bizParam:{}
    };
    
    mtop.getMtopinfo(params).then((res)=>{
        if(res.data.success){
            console.log(res.data.result.e.desc)
        }
    })
    
}
getCards()






