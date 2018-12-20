var app = getApp()
import Order from '../../comm/Order.js'
Page({
  data: {
		goods: {},//-- V2.X   
  },
  leaveMsg: function(e) {
    this.setData({
      leavemessage: e.detail.value
    })
  },
  onTokenChanged: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        is_balance: true
      })
    } else {
      this.setData({
        is_balance: false
      })
    }
    this.getTotalPrice()
  },
  onLoad: function(options) {
    var chosedObj = wx.getStorageSync('chosedObj')
    this.setData({
			goods: chosedObj
		}, this.submitOrder())		
  },
  onShow: function() {
		
  },
	//-- 提交订单
	submitOrder(){
		Order.Submit({ user_id: app.USER_ID(), store_id: this.data.goods.store_id, cart_id:0, up_user_id: app.USER().higher_up.id || 0}).then(r=>{
			console.log('Order.Submit => ',r)
		})
	},
	//-- 增加数量
	addcount: function (e) {
		let goods = this.data.goods
		goods.goods_number++
		this.setData({
			goods: goods
		})
	},
	//-- 减少数量
	subcount: function (e) {
		if (this.data.goods.goods_number > 1) {
			let goods = this.data.goods
			goods.goods_number--
			this.setData({
				goods: goods
			})
		}
	},
  //-- 计算金额
  getTotalPrice: function() {
    let shopMode = this.data.shopMode
    app.getTotalPrice({
      token: app.userInfo().token,
      shop_id: this.data.shop_id,
      num: shopMode.count,
      tuanselect: this.data.is_tuijian ? 0 : 1,
      sku_id: shopMode.shop_sku[shopMode.chosedIdx].sku_id,
      is_token: this.data.is_token ? 1 : 0,
      is_balance: this.data.is_balance ? 1 : 0
    }, res => {
      console.log('getTotalPrice:', res.data)
      let dt = res.data.data
      if (res.data.status == 1) {
        dt.balance_use = dt.balance_use || 0
        dt.token_use = dt.token_use || 0
        this.setData({
          lastMoney: dt
        })
      }
    })
  },
  //-- 生成订单并且支付
  createOrderAndPay: function() {
    let shopMode = this.data.shopMode
    app.createOrder({
      token: app.userInfo().token,
      rec_token: app.globalData.rec_token || '',
      shop_id: this.data.shop_id,
      num: shopMode.count,
      tuanselect: this.data.is_tuijian ? 0 : 1,
      sku_id: shopMode.shop_sku[shopMode.chosedIdx].sku_id,
      is_token: this.data.is_token ? 1 : 0,
      is_balance: this.data.is_balance ? 1 : 0,
      leavemessage: this.data.leavemessage,
      tuan_id: this.data.tuan_id
    }, res => {
      console.log('createOrder:', res.data)
      if (res.data.data.order_cn) {
        this.setData({
          order_no: res.data.data.order_cn
        })
        this.wexinpay()
      }
      if (res.data.status == 0) {
        app.msgbox({
          content: res.data.message,
          showCancel: false
        })
      }

    })
  },
  //-- 代币微信支付
  wexinpay: function() {
    app.post('https://m.58daiyan.com/MinimallApi/orderQuery/', {
      token: app.userInfo().token,
      order_no: this.data.order_no
    }, res => {
      var tuan_id = res.data.data.order_id
      console.log('orderQuery:', res.data)
      if (res.data.status == 2) {
        app.msgbox({
          content: res.data.message,
          showCancel: false,
          success: d => {
            let url = `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`
            if (this.data.is_tuijian) {
              url = `/pages/groupbuy/orderdetail?order_no=${this.data.order_no}`
            }
            wx.redirectTo({
              url: url,
            })
          }
        })
      } else {
        wx.login({
          success: res => {
            if (res.code) {
              app.post('https://m.58daiyan.com/MinimallApi/wechatpay', {
                order_no: this.data.order_no,
                token: app.userInfo().token,
                code: res.code
              }, r => {
                console.log('recharge:', r.data)
                if (r.data.status == 1) {
                  var obj = r.data.data
                  wx.requestPayment({
                    'timeStamp': obj.timeStamp,
                    'nonceStr': obj.nonceStr,
                    'package': obj.package,
                    'signType': obj.signType,
                    'paySign': obj.paySign,
                    'success': res => {
                      app.msgbox({
                        content: '支付成功',
                        showCancel: false,
                        success: d => {
                          let url = `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`
                          if (this.data.is_tuijian) {
                            url = `/pages/groupbuy/orderdetail?order_no=${this.data.order_no}`
                          }
                          wx.redirectTo({
                            url: url,
                          })
                        }
                      })
                    },
                    'fail': res => {
                      var msg = '支付失败:';
                      if (res.err_desc) {
                        msg = msg + res.err_desc
                      }
                      if (res.errMsg && res.errMsg.indexOf('cancel') > 0) {
                        msg = msg + '取消支付'
                      }
                      app.msgbox({
                        content: msg,
                        showCancel: false,
                        success: d => {
                          //-- 跳转到未付款订单页
                          wx.navigateTo({
                            url: `orderdetail?order_no=${this.data.order_no}`,
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    })

  },
})