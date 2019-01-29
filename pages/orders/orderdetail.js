var app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
import Order from '../../comm/Order.js'
import Address from '../../comm/Address.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    order_id: 0,
    order: {},
    waiting: false,
    addressList: [],
    defaultAddress: {
      district: '请配置选择收货地址'
    },
    expressList: [],
		paytype:1
  },
	//-- 选择支付方式事件
	onChosedPayType(e) {
		this.setData({
			paytype: e.currentTarget.dataset.pid
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
  //-- 查看物流
  showExpress() {
    wx.navigateTo({
      url: `expressdetail?user_id=${this.data.order.user_id}&order_id=${this.data.order.id}`,
    })
  },
  onLoad: function(options) {
    this.data.order_id = options.id || 0
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
    this.loadOrderDetail()
  },
  //-- 去商品详情
  toShopDetail(e) {
    let url = `/pages/shop/details?id=${e.currentTarget.dataset.id}&spec=${e.currentTarget.dataset.spec}`
    wx.navigateTo({
      url
    })
  },
  onTakeDelivery() {
    Order.TakeDelivery({
        user_id: app.USER_ID(),
        order_id: this.data.order_id
      })
      .then(r => {
        console.log('Order.TakeDelivery => ', r)
        if (r.code == 200) {
          app.msg(r.message)
          this.loadOrderDetail()
        } else {
          app.ERROR(r.message)
        }
      })
  }, 
  loadOrderDetail: function() {
    Order.Get({
      user_id: app.USER_ID(),
      order_id: this.data.order_id
    }).then(r => {
      console.log('Order.Get => ', r)
      if (r.code === 200) {
				r.data.statMsg = app.getOrderStatusTxt(r.data.order_status)
        r.data.addtime = TimeConverter.ToLocal(r.data.addtime)
        r.data.goods = r.data.goods.map(u => {
          u.use_chosed = u.spec_num
          u.can_use = u.spec_num - u.use_num
          u.spec_color = u.spec_color.trim()
          u.spec_size = u.spec_size.trim()
          return u;
        })
        this.setData({
          order: r.data
        })
      }
      if (r.data.store.on_line == 1) {
        Order.Express({
            user_id: r.data.user_id,
            order_id: this.data.order_id
          })
          .then(rr => {
            console.log('Order.Express => ', rr)
            if (rr.code == 200) {
              this.setData({
                expressList: rr.data
              })
            }
          })
      }
    })
  },
  //-- 增加消费数量
  onAddUseNum(e) {
    let order = this.data.order
    let idx = e.currentTarget.dataset.idx
    if (order.goods[idx].use_chosed < order.goods[idx].can_use) {
      order.goods[idx].use_chosed++
        this.setData({
          order: order
        })
    }
  },
  //-- 减少消费数量 
  onSubUseNum(e) {
    let order = this.data.order
    let idx = e.currentTarget.dataset.idx
    if (order.goods[idx].use_chosed > 1) {
      order.goods[idx].use_chosed--
        this.setData({
          order: order
        })
    }
  },
  //-- 去评价
  gotoEvaluate(e) {
    wx.navigateTo({
      url: `/pages/usercenter/comment?stat=0&id=${e.currentTarget.dataset.goods}`,
    })
  },
  //-- 一键消费
  onOneKeyshowQR() {
    let arr = this.data.order.goods
    let data = [
      app.USER_ID(),
      this.data.order.id,
      0,
      0,
      this.data.order.store_id,
      this.data.order.order_sn
    ]
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      foreground: '#2c2c2c',
      text: data.join('-')
    })
    this.setData({
      showqrbox: true,
      qr_msg: `整单一键消费`,
      waiting: true
    }, () => {
      this.waitingScan(0)
    })
  },
  //-- 弹出消费二维码
  showQR: function(e) {
    let idx = e.currentTarget.dataset.idx
    let arr = this.data.order.goods
    let item = arr[idx]
    let data = [
      app.USER_ID(),
      this.data.order.id,
      item.use_chosed,
      item.id,
      this.data.order.store_id,
      item.goods_name
    ]
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      foreground: '#2c2c2c',
      text: data.join('-')
    })
    this.setData({
      showqrbox: true,
      qr_msg: `${item.use_chosed}份 ${item.goods_name}(${item.spec_color}${item.spec_size})`,
      waiting: true
    }, () => {
      this.waitingScan(idx)
    })
  },
  waitingScan(idx) {
    let waitting = this.data.waiting
    if (waitting) {
      Order.GetNoLoading({
        user_id: app.USER_ID(),
        order_id: this.data.order_id
      }).then(r => {
        console.log('Order.Get => ', r)
        if (r.code === 200) {
          let source = this.data.order.goods[idx]
          let item = r.data.goods[idx]
          if (item.use_num != source.use_num) {
            app.SUCCESS('消费成功', () => {
              this.setData({
                waiting: false
              }, this.closeQrBox)
            })
          } else {
            setTimeout(() => {
              this.waitingScan(idx)
            }, 1000)
          }
        }

      })
    }
  },
  //-- 关闭消费二维码
  closeQrBox() {
    this.setData({
      showqrbox: false,
      qr_msg: '',
      xh: false,
      waiting: false
    })
    this.loadOrderDetail()
  },
  //-- 分享到用户或群
  onShareAppMessage: function(res) {
    var resObj = {};
    if (res.from === 'button') {
      let title = `${this.data.text1}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}`
      if (this.data.text0 == 'B')
        title = `${this.data.text1}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}`

      let path = `/pages/tuijian/detail?id=${this.data.shop_id}&rec_token=${app.userInfo().token}&choseIdx=${this.data.shopMode.chosedIdx}`
      if (this.data.qualification != 1)
        path = `/pages/tuijian/detail?id=${this.data.shop_id}&choseIdx=${this.data.shopMode.chosedIdx}`
      console.log('path:', path)
      resObj = {
        title: title,
        path: path,
        imageUrl: this.data.shopMode.image,
        success: res => {
          this.hideShareBox()
          app.request('https://m.58daiyan.com/MinimallApi/recommend', 'POST', {
            rec_token: app.userInfo().token,
            shop_id: this.data.shop_id
          }, false, res => {

          })
        }
      }
      console.log('resObj:', resObj)
    } else {
      resObj = {
        title: app.globalData.shareTB,
        path: '/pages/shop/index?rec_token=' + app.userInfo().token,
        imageUrl: app.globalData.shareImg[1],
        success: res => {
          console.log('share path:', '/pages/shop/index?rec_token=' + app.userInfo().token)
        }
      }
    }
    return resObj
  },
  //-- 取消订单
  cancelOrder(e) {
    Order.Cancel({
      user_id: app.USER_ID(),
      order_id: e.currentTarget.dataset.order
    }).then(r => {
      console.log('Order.Cancel => ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message, () => {
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  //-- 删除订单
  delOrder(e) {
    app.CONFIME("订单删除后不能恢复，确定删除该订单吗？", () => {
      Order.Delete({
        user_id: app.USER_ID(),
        order_id: e.currentTarget.dataset.order
      }).then(r => {
        console.log('Order.Cancel => ', r)
        if (r.code == 200) {
          app.SUCCESS(r.message, this.loadUserOrderList)
        } else {
          app.ERROR(r.message)
        }
      })
    })
  },
  //-- 确定订单并支付
  ConfirmOrderAndPay() {
    if (this.data.order.store.on_line == 1 && !this.data.defaultAddress.addr_detail) {
      app.ERROR('请配置收货地址')
      return
    }
		let pay_type = 0
		if(this.data.paytype == 2){
			pay_type=1
		}
    this.payOrder(this.data.order.order_sn, this.data.order.id,pay_type)
  },
  /**
   * 确定订单
   */
  payOrder(order_sn, order_id,pay_type=0) {
    if (this.data.order.store.on_line == 1) {
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
            if (r.code == 200) {
							this.useWeChatPay(r.data, order_id)
						} else if (r.code == 0 || r.code == 1) {
              app.msgbox({
                content: r.message,
                showCancel: false,
                success: d => {
                  this.loadOrderDetail()
                }
              })
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
        order_sn,
				pay_type
      }).then(r => {
        console.log('Order.PayOrder => ', r)
        if (r.code == 200) {
					this.useWeChatPay(r.data, order_id)
				} else if (r.code == 0 || r.code == 1) {
					app.msgbox({
						content: r.message,
						showCancel: false,
						success: d => {
							this.loadOrderDetail()
						}
					})
				}else {
          app.ERROR(`确认订单失败！`)

        }
      })
    }

  },
  /**微信支付 */
	useWeChatPay(obj, order_id) {
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
						Order.AfterPaySuccess({
							user_id: app.USER_ID(),
							order_id
						}).then(r=>{
							this.loadOrderDetail()
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
          success: d => {}
        })
      }
    })
  },
})