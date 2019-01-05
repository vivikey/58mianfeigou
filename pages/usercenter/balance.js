var app=getApp()
Page({
  data: {
		type:1
  },
  onLoad(options) {     
		this.setData({
			type:options.type || 1
		})
  },
	//-- 切换类型
	onChangeType(e){
		this.setData({
			type:e.currentTarget.id
		})
	},
  onShow() {
  }
})