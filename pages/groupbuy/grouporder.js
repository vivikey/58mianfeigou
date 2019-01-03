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
    }
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
    if (!goods.orderDirect) {
      if (goods.group_id) {
        this.JoinGroup()
      } else {
        this.SubmitGroup()
      }
    } else {
      this.Submit()
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
  onShow: function() {
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
  //-- 确定订单并支付
  ConfirmOrderAndPay() {
    this.payOrder(this.data.order.order_sn, this.data.order.id)
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
  payOrder(order_sn, order_id) {
    if (this.data.goods.store_info.on_line == 1) {
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
        } else {
          app.ERROR("订单已生成，但地址配置失败！")
        }
      })
    } else {
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
            if (!this.data.goods.orderDirect) { //-- 拼团
              wx.redirectTo({
                url: `/pages/groupbuy/injoin?group_id=${this.data.order.group_id}`,
              })
            } else {
							wx.redirectTo({
                url: `/pages/orders/orderdetail?id=${this.data.order.id}`
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
						wx.redirectTo({
              url: `/pages/orders/index?idx=1`
            })
          }
        })
      }
    })
  },
})