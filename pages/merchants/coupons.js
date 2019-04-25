var app=getApp()
import Store from '../../comm/Store.js'
Page({
	data: {
		storeName: '',
		storeId: 0,
		version: '',
		couponsList: [],
		couponsGroupList: [],
	},

	onLoad(options) {
		this.data.storeId = options.storeId
		this.setData({
			storeName: options.storeName,
			version: app.VERSION()
		})
	},
	onShow() {
		this.getCouponList()
		this.getCouponsGroupList()
	},
	getCouponList(){
		let user_id = app.USER_ID()
		let store_id = this.data.storeId
		Store.CouponList({user_id,store_id})
		.then(r=>{
			let couponsList = []
			if(r.code == 200){
				couponsList = r.data
			}
			this.setData({
				couponsList
			})
		})
	},
	addCouponType1(){
		wx.navigateTo({
			url: `couponinfo?coupon_type=1&store_id=${this.data.storeId}`,
		})
	},
	addCouponType2() {
		wx.navigateTo({
			url: `couponinfo?coupon_type=2&store_id=${this.data.storeId}`,
		})
	},
	addCouponType3() {
		wx.navigateTo({
			url: `couponinfo?coupon_type=3&store_id=${this.data.storeId}`,
		})
	},
	toDetail(e){
		let {id,type}=e.currentTarget.dataset
		wx.navigateTo({
			url: `couponinfo?id=${id}&coupon_type=${type}&store_id=${this.data.storeId}`,
		})
	},

	getCouponsGroupList(){
		let user_id = app.USER_ID()
		let store_id = this.data.storeId
		Store.CouponGroupList({user_id,store_id})
		.then(r=>{
			let couponsGroupList = []
			if(r.code==200){
				couponsGroupList = [...r.data]
			}
			this.setData({
				couponsGroupList
			})
		})
	},
	toSetCouponGroup(e){
		let { id=0 } = e.currentTarget.dataset
		wx.navigateTo({
			url: `coupongroup?id=${id}&store_id=${this.data.storeId}`,
		})
	},
	toDeleteCouponGroup(e) {
		app.CONFIME("组合券删除后不能恢复，确定删除该组合券吗？", () => {
			let { id = 0 } = e.currentTarget.dataset
			Store.CouponGroupDelete({ user_id: app.USER_ID(), combinate_id:id }).then(r => {
				if (r.code === 200) {
					app.SUCCESS(r.message, this.getCouponsGroupList)
				} else {
					app.ERROR(r.message)
				}
			})
		})
	},
})