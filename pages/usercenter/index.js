var app = getApp()
import UserCenter from '../../comm/UserCenter.js'
Page({
  data: {
    version: '',
    user: {},
  },
  onLoad(options) {
    this.setData({
      version: app.VERSION()
    })

  },
  onShow() {
		UserCenter.Get({user_id:app.USER_ID()}).then(r=>{
			console.log('UserCenter.Get => ',r)
			if (r.code == 200 && r.data.user.user_img){
				let user = r.data.user
				user.member = r.data.member
				user.attentStore = r.data.attentStore
				user.collectGoods = r.data.collectGoods
				user.awaitAffirm = r.data.awaitAffirm //-- 待消费
				user.awaitGroup = r.data.awaitGroup //-- 拼团中
				user.awaitPay = r.data.awaitPay //-- 待付款
				user.awaitShip = r.data.awaitShip //-- 待发货
				user.awaitTake = r.data.awaitTake //-- 待收货
				app.USER(user)
				this.setData({
					user:user,
				})
			}else{
				wx.navigateTo({
					url: '/pages/index/auth',
				})
			}
		})
  },
  //--2.X 转向用户信息编辑
  toEditUserInfo() {
    wx.navigateTo({
      url: 'userinfo',
    })
  },
	//--2.X 转向我的账户
	toMyBalance(e){
		wx.navigateTo({
			url: `balance?type=${e.currentTarget.dataset.type}`,
		})
	}
})