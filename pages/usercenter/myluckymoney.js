var app=getApp()
import UserCenter from '../../comm/UserCenter.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
	data: {
		version:'',
		luckyMoneyList:[]
	},
	onLoad(options) {
		this.setData({
			version:app.VERSION()
		})
	},
	toLuckyMoneyShare(e){
		const {id} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/merchants/luckymoneyshare?user_red_id=${id}`,
		})
	},
	onShow() {
		UserCenter.UserLuckyMoneyList({user_id:app.USER_ID()})
		.then(r=>{
			console.log('UserCenter.UserCouponShowList => ',r)
			let luckyMoneyList = []
			if(r.code==200){
				luckyMoneyList=[...r.data.map(u=>{
					u.timeout = TimeConverter.GetToday() > u.red_end
					return u
				})]
			}
			this.setData({
				luckyMoneyList
			})
		})
	}
})