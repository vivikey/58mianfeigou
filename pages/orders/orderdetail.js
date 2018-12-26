var app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
import Order from '../../comm/Order.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    order_id: 0,
		order:{}
  },
  onLoad: function(options) {
		this.data.order_id = options.id || 0
  },
  onShow: function() {
    this.loadOrderDetail()
  },
	getOrderStatusTxt(order_status) {
		switch (order_status) {
			case 0:
				return '待付款'
			case 1001:
			case 1021:
				return '待发货'
			case 1011:
			case 2011:
				return '拼团中'
			case 1002:
			case 1012:
			case 1022:
				return '待收货'
			case 2003:
			case 2013:
			case 2023:
				return '待消费'
			default:
				return '已完成'
		}
	},
  loadOrderDetail: function() {
		Order.Get({user_id:app.USER_ID(),order_id:this.data.order_id}).then(r=>{
			console.log('Order.Get => ',r)
			if(r.code===200){
				r.data.statMsg = this.getOrderStatusTxt(r.data.order_status)
				r.data.addtime = TimeConverter.ToLocal(r.data.addtime)
				r.data.goods = r.data.goods.map(u=>{
					u.use_chosed = u.spec_price
					return u;
				})
				this.setData({
					order:r.data
				})
			}
		})
  },
	//-- 去评价
	gotoEvaluate(e){
		wx.navigateTo({
			url: `/pages/usercenter/comment?stat=0&id=${e.currentTarget.dataset.goods}`,
		})
	},
  //-- 弹出消费二维码
  showQR: function(e) {
    var idx = e.currentTarget.dataset.idx
    var arr = this.data.order_goods_info
    var item = arr[idx]
    var text = `{"token":"${app.userInfo().token}","num":"${item.use_chosed}","order_id":"${item.order_id}","title":"${item.goods_name}","is_tuan":"${this.data.order_info.tuanselect}","tuan_id":"${this.data.tuan_id}","store_id":"${this.data.order_info.store_id}"}`
    console.log('qrcode:', text)
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      foreground: '#50d1fe',
      text: text
    })
    this.setData({
      showqrbox: true,
      qr_msg: `${item.use_chosed}份 ${item.goods_name}`
    })

    this.checkOutQrCodeStat(idx)
  },
  //-- 关闭消费二维码
  closeQrBox: function() {
    this.setData({
      showqrbox: false,
      qr_msg: '',
      xh: false
    })
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
		Order.Cancel({ user_id: app.USER_ID(), order_id: e.currentTarget.dataset.order }).then(r => {
			console.log('Order.Cancel => ', r)
			if (r.code == 200) {
				app.SUCCESS(r.message, this.loadUserOrderList)
			} else {
				app.ERROR(r.message)
			}
		})
	},
	//-- 删除订单
	delOrder(e) {
		app.CONFIME("订单删除后不能恢复，确定删除该订单吗？", () => {
			Order.Delete({ user_id: app.USER_ID(), order_id: e.currentTarget.dataset.order }).then(r => {
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
		this.payOrder(this.data.order.order_sn, this.data.order.id)
	},
	/**
 * 确定订单
 */
	payOrder(order_sn, order_id) {
		if (this.data.order.store.on_line == 1) {
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
						this.loadOrderDetail()
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
					}
				})
			}
		})
	},
})