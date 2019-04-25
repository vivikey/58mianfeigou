var app=getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
	data: {
		storeName: '',
		storeId: 0,
		version: '',
		luckyMoneyList:[]
	},
	toDetail(e){
		const {id} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/merchants/luckymoneyinfo?id=${id}&storeId=${this.data.storeId}&storeName=${this.data.storeName}`,
		})
	},
	toShare(e){
		const { id } = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/merchants/luckymoneyshare?id=${id}&storeId=${this.data.storeId}&storeName=${this.data.storeName}`,
		})
	},
	onLoad(options) {
		this.setData({
			storeName: options.storeName,
			version: app.VERSION(),
			storeId: options.storeId
		})
	},
	onShow() {
		const {storeId} = this.data
		Store.LuckyMoneyList({
			store_id:storeId,
			user_id:app.USER_ID()
		}).then(r=>{
			console.log('Store.LuckyMoneyList => ',r)
			let luckyMoneyList = []
			if(r.code==200){
				luckyMoneyList = [...r.data.map(u=>{
					u.addtime = TimeConverter.ToLocal(u.addtime*1000)
					return u
				})]
			}
			this.setData({
				luckyMoneyList
			})
		})
	},


})