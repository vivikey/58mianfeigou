var app=getApp()
import UserCenter from '../../comm/UserCenter.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
	data: {
		couponsList:[]
	},
	onLoad(options) {

	},
	onShow() {
		UserCenter.UserCouponShowList({user_id:app.USER_ID()})
		.then(r=>{
			console.log('UserCenter.UserCouponShowList => ',r)
			let couponsList = []
			if(r.code==200){
				couponsList=[...r.data.map(u=>{
					u.timeout = TimeConverter.GetToday() > u.coupon_end 
					return u
				})]
			}
			this.setData({
				couponsList
			})
		})
	}
})