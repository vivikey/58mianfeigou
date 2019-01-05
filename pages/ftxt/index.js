var app = getApp()
import FrontEndFTxt from '../../comm/FrontEndFTxt.js'
var pageObj = {
  data: {
    version: '',
    user: {},    
  },
  //-- 页面加载事件
  onLoad: function(options) {
    app.HIGHER_UP(options.higher_up || 0)
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
    })
  },
  //-- 每次进入页面触发
  onShow() {
		this.loadFTextList()
  },
	loadFTextList(){
		FrontEndFTxt.List({user_id:app.USER_ID()}).then(r=>{
			console.log('FrontEndFTxt.List => ',r)
		})
		FrontEndFTxt.Get({ user_id: app.USER_ID(),ad_id:4 }).then(r => {
			console.log('FrontEndFTxt.Get => ', r)
		})
	},
	onReachBottom() {
		console.log('============= 上拉事件发生了 =============')
	}
}
import pageex from "../../utils/pageEx.js"

pageex(pageObj)

Page(pageObj)