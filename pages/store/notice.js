var app=getApp()
Page({
	data: {
		notice:{}
	},
	onLoad(options) {
		wx.getStorage({
			key: 'notice',
			success: res => {
				console.log('wx.getStorage.notice => ',res)
				if (res.errMsg == "getStorage:ok"){
					this.data.notice = res.data
				}else{
					app.ERROR(res.errMsg)
				}
			},
		})
	},
	onShow() {

	},
	onReady(){
		this.setData(this.data)
	},
	onUnload: function () {

	}
})