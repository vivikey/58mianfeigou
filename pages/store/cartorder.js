var app = getApp()
import FrontEndStore from '../../comm/FrontEndStore.js'
import Cart from '../../comm/Cart.js'
import Order from '../../comm/Order.js'
import Address from '../../comm/Address.js'
Page({
  data: {
    store_id: 0,
    storeCart: {
      cart_list: [],
      total_num: 0,
      total_price: 0,
      transport_cost: 0
    },
    store: {},
    addressList: [],
    defaultAddress: {
      district: '请配置选择收货地址'
    }
  },
  /**
   * 确定订单
   */
  payOrder(order_sn, order_id) {
		if (this.data.store.on_line == 1){
    Order.OrderAddr({
      user_id: app.USER_ID(),
      order_id,
      addr_id: this.data.defaultAddress.id
    }).then(r => {
      if (r.code == 200) {
        Order.PayOrder({
          user_id: app.USER_ID(),
          order_sn
        }).then(r => {
          console.log('Order.PayOrder => ', r)
					if (r.code == 200) {
						this.useWeChatPay(r.data)
					} else {
						app.ERROR(`确认订单失败！`)

					}
        })
      }else{
				app.ERROR("订单已生成，但地址配置失败！")
			}
    })
		}else{
			Order.PayOrder({
				user_id: app.USER_ID(),
				order_sn
			}).then(r => {
				console.log('Order.PayOrder => ', r)
				if (r.code == 200) {
					this.useWeChatPay(r.data)
				} else {
					app.ERROR(`确认订单失败！`)

				}
			})
		}

  },
  /**
   * 提交订单
   */
  submitOrder() {
    let cartList = this.data.storeCart.cart_list
    let ids = cartList.map(u => u.cart_id).join(',')
    console.log('submitOrder => ', ids)
    Order.Submit({
      user_id: app.USER_ID(),
      store_id: this.data.store_id,
      cart_id: ids,
      up_user_id: app.USER().higher_up.id || 0
    }).then(r => {
      console.log('Order.Submit => ', r)
      if (r.code == 200) {
        // wx.navigateTo({
        // 	url: `/pages/orders/pay?order_sn=${r.data.order_sn}&money=${r.data.goods_price}`,
        // })
        this.payOrder(r.data.order_sn, r.data.id)
      } else {
        app.ERROR("提交订单失败！")
      }
    })
  },
  //-- 获取用户收货地址
  getUserAddress() {
    Address.List({
      user_id: app.USER_ID()
    }).then(r => {
      console.log('Address.List => ', r)
      if (r.data.length > 0) {
        let defaddr = r.data.find(item => item['default'] == 1)
        defaddr = defaddr || r.data[0]
        this.setData({
          defaultAddress: defaddr
        })

      }

    })
  },
  onLoad: function(options) {
    let store_id = options.store_id || 0
    this.data.store_id = store_id
    FrontEndStore.Get({
      user_id: app.USER_ID(),
      store_id
    }).then(r => {
      console.log('FrontEndStore.Get => ', r)
      if (r.code == 200) {
        this.setData({
          store: r.data
        })
        if (r.data.on_line == 1) {
          this.getUserAddress()
        }
      } else {
        app.ERROR('系统错误，请稍候重试！', wx.navigateBack({
          delta: 1
        }))
      }
    })
  },
  onShow: function() {
    Cart.List({
      user_id: app.USER_ID(),
      store_id: this.data.store_id
    }).then(r => {
      console.log('Cart.List => ', r)
      if (r.code == 200 && r.data.cart_list) {
        this.setData({
          storeCart: r.data
        })
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    })

    let chosedAddress = wx.getStorageSync("chosedAddress") || null
    if (!chosedAddress) {
      this.getUserAddress()
    } else {
      this.setData({
        defaultAddress: chosedAddress
      }, wx.removeStorage({
        key: 'chosedAddress',
        success: function(res) {},
      }))
    }
  },
	/**微信支付 */
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
						if (this.data.store.on_line === 1) {
							wx.navigateTo({
								url: `/pages/orders/index?idx=2`
							})
						} else {
							wx.navigateTo({
								url: `/pages/orders/index?idx=4`
							})
						}
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
							url: `/pages/orders/index?idx=1`
            })
          }
        })
      }
    })
  },
})