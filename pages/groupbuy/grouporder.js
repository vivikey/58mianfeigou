var app = getApp()
import Order from '../../comm/Order.js'
import Address from '../../comm/Address.js'
Page({
  data: {
    goods: {}, //-- V2.X   
    order: {},
    addressList: [],
    defaultAddress: {
      district: '请配置选择收货地址'
    },
    userBalancePay: false,
    paytype: 1
  },
  onLoad: function(options) {
    var chosedObj = wx.getStorageSync('chosedObj')
    console.log('chosedObj => ', chosedObj)
    this.setData({
      goods: chosedObj
    }, () => {
      this.firstRun()
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
  //-- 页面第一次加载时运行
  firstRun() {
    let goods = this.data.goods
    console.log('firstRun goods => ', goods)
    switch (goods.orderDirect) {
      case 0: //--0 直购
        this.Submit()
        break;
      case 1: //--1 拼团 
        if (goods.group_id) {
          this.JoinGroup()
        } else {
          this.SubmitGroup()
        }
        break;
      case 2: //-- 赠品
        this.SubmitAcGift()
        break;
    }
  },
  //-- JoinGroup
  JoinGroup() {
    Order.JoinGroup({
      user_id: app.USER_ID(),
      spec_id: this.data.goods.goods_spec.id,
      spec_num: this.data.goods.goods_number,
      group_purchase: 1,
      group_id: this.data.goods.group_id
    }).then(r => {
      console.log('Order.JoinGroup => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message, () => {
          wx.navigateBack({
            detail: 1
          })
        })
      }
    })
  },
  onShow() {
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
  //-- 提交直购订单
  Submit() {
    Order.SubmitSingle({
      user_id: app.USER_ID(),
      goods_id: this.data.goods.id,
      spec_id: this.data.goods.goods_spec.id,
      spec_num: this.data.goods.goods_number
    }).then(r => {
      console.log('Group.Pub => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message, () => {
          wx.navigateBack({
            detail: 1
          })
        })
      }
    })
  },
  SubmitAcGift() {
    Order.AcGift({
      user_id: app.USER_ID(),
      goods_id: this.data.goods.id,
      spec_id: this.data.goods.goods_spec.id,
      spec_num: this.data.goods.goods_number
    }).then(r => {
      console.log('Group.Pub => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message, () => {
          wx.navigateBack({
            detail: 1
          })
        })
      }
    })
  },
  //-- 提交开团订单
  SubmitGroup() {
    Order.SubmitGroup({
      user_id: app.USER_ID(),
      spec_id: this.data.goods.goods_spec.id,
      spec_num: this.data.goods.goods_number,
      group_purchase: 1
    }).then(r => {
      console.log('Group.Pub => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message, () => {
          wx.navigateBack({
            detail: 1
          })
        })
      }
    })
  },
  //-- 选择支付方式事件
  onChosedPayType(e) {
    this.setData({
      paytype: e.currentTarget.dataset.pid
    })
  },
  //-- 立即支付
  toPay() {
    if (this.data.paytype == 1) {
      this.ConfirmOrderAndPay()
    }
    if (this.data.paytype == 2) {
      this.ConfirmOrderAndPayWithMoney()
    }
  },
  //-- 确定订单并微信支付
  ConfirmOrderAndPay() {
    if (this.data.order.store.on_line == 1 && !this.data.defaultAddress.addr_detail) {
      app.ERROR('请配置收货地址')
      return
    }
    this.payOrder(this.data.order.order_sn, this.data.order.id)
  },
  //-- 确定订单并余额支付
  ConfirmOrderAndPayWithMoney() {
    if (this.data.order.store.on_line == 1 && !this.data.defaultAddress.addr_detail) {
      app.ERROR('请配置收货地址')
      return
    }
    this.payOrder(this.data.order.order_sn, this.data.order.id, 1)
  },
  //-- 增加数量
  addcount: function(e) {
    let order_id = this.data.order.id
    let {
      goods_id,
      spec_id
    } = this.data.order.goods[0]
    Order.AddNumber({
      user_id: app.USER_ID(),
      order_id,
      goods_id,
      spec_id
    }).then(r => {
      console.log('Order.AddNumber => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  //-- 减少数量
  subcount: function(e) {
    if (this.data.order.total_num < 2) {
      return;
    }
    let order_id = this.data.order.id
    let {
      goods_id,
      spec_id
    } = this.data.order.goods[0]
    Order.SubNumber({
      user_id: app.USER_ID(),
      order_id,
      goods_id,
      spec_id
    }).then(r => {
      console.log('Order.SubNumber => ', r)
      if (r.code === 200) {
        this.setData({
          order: r.data
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  /**
   * 确定订单
   */
  payOrder(order_sn, order_id, pay_type = 0) {
    if (this.data.goods.store_info.on_line == 1) {
      Order.OrderAddr({
        user_id: app.USER_ID(),
        order_id,
        addr_id: this.data.defaultAddress.id
      }).then(r => {
        if (r.code == 200) {
          Order.PayOrder({
            user_id: app.USER_ID(),
            order_sn,
            pay_type
          }).then(r => {
            console.log('Order.PayOrder => ', r)
            if (r.code == 1) { //-- 余额支付
							//this.checkJiFenOrder()
							this.onSuccess(r)
            } else if (r.code == 200) { //-- 微信支付
              this.useWeChatPay(r.data)
            } else {
              app.ERROR(r.message)

            }
          })
        } else {
          app.ERROR("订单已生成，但地址配置失败！")
        }
      })
    } else {
      Order.PayOrder({
        user_id: app.USER_ID(),
        order_sn,
        pay_type
      }).then(r => {
        console.log('Order.PayOrder => ', r)
        if (r.code == 1) {
					//this.checkJiFenOrder()
					this.onSuccess(r)
        } else if (r.code == 200) {
          this.useWeChatPay(r.data)
        } else {
          app.ERROR(r.message)

        }
      })
    }

  },
	/**已废弃 */
	checkJiFenOrder(){
		if (this.data.order.order_type == 3) { //-- 积分兑换
			Order.AfterIntegralPay({
				user_id: app.USER_ID(),
				order_id: this.data.order.id
			}).then(rr => {
				console.log('Order.AfterIntegralPay => ', rr)
				if (rr.code == 200) {
					this.onSuccess()
				} else {
					app.ERROR(rr.message)
				}
			})
		} else {
			this.onSuccess()
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
      'success': res=>{
				//this.checkJiFenOrder()
				this.onSuccess(res)
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
            wx.redirectTo({
              url: `/pages/orders/index?idx=1`
            })
          }
        })
      }
    })
  },
  onSuccess(res) {
    app.msgbox({
      content: '支付成功',
      showCancel: false,
      success: d => {
				Order.AfterPaySuccess({
					user_id:app.USER_ID(),
					order_id: this.data.order.id
				}).then(r=>{
					if (this.data.goods.orderDirect == 1) { //-- 拼团
						wx.redirectTo({
							url: `/pages/groupbuy/injoin?group_id=${this.data.order.group_id}`,
						})
					} else {
						wx.redirectTo({
							url: `/pages/orders/orderdetail?id=${this.data.order.id}`
						})
					}
				})
      }
    })
  }
})