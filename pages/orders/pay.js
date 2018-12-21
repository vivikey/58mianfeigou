var app = getApp()
import FrontEndStore from '../../comm/FrontEndStore.js'
import Cart from '../../comm/Cart.js'
import Order from '../../comm/Order.js'
Page({
  data: {
		order_sn:'2018122100000000ABCDE',
		money:28.8,
		version:''
  },
  //-- WX.Pay
  useWeChatPay(obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp.toString(),
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': res => {
        app.msgbox({
          content: '支付成功',
          showCancel: false,
          success: d => {
            wx.switchTab({
							url:  `/pages/usercenter/index`
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
						wx.switchTab({
							url: `/pages/usercenter/index`
						})
          }
        })
      }
    })
  },
  //-- payOrder
	payOrder() {
		let order_sn = this.data.order_sn
    Order.PayOrder({
      user_id: app.USER_ID(),
			order_sn
    }).then(r => {
      console.log('Order.PayOrder => ', r)
			if(r.code==200){
				this.useWeChatPay(r.data)
			}else{
				app.ERROR(`确认订单失败！${r.message}`)
			}

    })
  },
  onLoad: function(options) {
		let order_sn = options.order_sn
		let money = options.money
		console.log('order_sn : ', order_sn)
	
		this.setData({
			version:app.VERSION(),
			order_sn: order_sn,
			money: money
		})
  },
  onShow: function() {

  }
})