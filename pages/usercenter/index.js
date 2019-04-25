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
	toMyLuckyMoney(){
		wx.navigateTo({
			url: 'myluckymoney',
		})
	},
	toMyCoupons(){
		wx.navigateTo({
			url: 'mycoupons',
		})
	},
  toMyQR() {
    wx.navigateTo({
      url: 'myqrcode',
    })
  },
  toBeMember() {
    wx.navigateTo({
      url: 'bemember',
    })
  },
  toMyJiFen() {
    wx.navigateTo({
      url: '/pages/my/mydaibi',
    })
  },
  /**充值 */
  onDeposit() {

  },
  /**提现 */
  onWithdrawDeposit() {

  },
  onShow() {
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=0&higher_up=${this.data.higher_up}`,
      })
    } else {
      UserCenter.Get({
        user_id: app.USER_ID()
      }).then(r => {
        console.log('UserCenter.Get => ', r)
        if (r.code == 200 && r.data.user.user_img) {
					r.data.user = r.data.user || r.data.userInfo
          let user = {...r.data.user,user_id:r.data.user.id}
          if (r.data.higher) {
            user.higher = r.data.higher
          } else {
            user.higher = null
          }
          user.member = r.data.member
          user.attentStore = r.data.attentStore
          user.collectGoods = r.data.collectGoods
          user.awaitAffirm = r.data.awaitAffirm //-- 待消费
          user.awaitGroup = r.data.awaitGroup //-- 拼团中
          user.awaitPay = r.data.awaitPay //-- 待付款
          user.awaitShip = r.data.awaitShip //-- 待发货
          user.awaitTake = r.data.awaitTake //-- 待收货
					user.show_store = r.data.show_store
          app.USER(user)
          this.setData({
            user: user,
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/auth',
          })
        }
      })
    }
  },
  //--2.X 转向用户信息编辑
  toEditUserInfo() {
    wx.navigateTo({
      url: 'userinfo',
    })
  },
  //--2.X 转向我的账户
  toMyBalance(e) {
    wx.navigateTo({
      url: `balance?type=${e.currentTarget.dataset.type}`,
    })
  }
})