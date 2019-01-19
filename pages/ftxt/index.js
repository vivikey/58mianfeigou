var app = getApp()
import FrontEndFTxt from '../../comm/FrontEndFTxt.js'
import TimeConverter from '../../comm/TimeConverter.js'
var pageObj = {
  data: {
    version: '',
    user: {},
    ftxtList:[]
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
      if(r.code==200){
        this.setData({
          ftxtList:r.data.map(u=>{
            u.addtime = TimeConverter.ToLocal(u.addtime)
            return u
          })
        })
      }
		})
	},
  //-- 进入详情
  toFTxtDetail(e){
    wx.navigateTo({
      url: `detail?id=${e.currentTarget.id}`,
    })
  },
	onReachBottom() {
		console.log('============= 上拉事件发生了 =============')
	}
}
import pageex from "../../utils/pageEx.js"

pageex(pageObj)

Page(pageObj)