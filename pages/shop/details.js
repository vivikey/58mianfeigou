var app = getApp()
import ToTop from "../../utils/ToTop.js"
import FrontEndShop from '../../comm/FrontEndShop.js'
import Address from '../../comm/Address.js'
import Cart from '../../comm/Cart.js'
import Order from '../../comm/Order.js'
import Evaluate from '../../comm/Evaluate.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
		...ToTop.data,
    user: {},
    screenHeight: 0,
    scrollPosition: 0,
    version: '',
    goods_id: 0,
    spec_id: 0,
    spec_chosed: 0,
    goods: {},
    evaluateList: [],
    classNavList: ['商品', '评价', '详情'],
    classNavActIdx: 0,
    sc: 0,
    addressList: [],
    defaultAddress: {
      district: '请配置选择收货地址'
    },
    showShareWnd: false,
    timerid: 0
  },
	...ToTop.methods,
  toCartOrder() {
    wx.navigateTo({
      url: `/pages/store/cartorder?store_id=${this.data.goods.store_id}`,
    })
  },
  swiperChange: function(e) {
    this.setData({
      sc: e.detail.current
    })
  },
  onLoad(options) {
    /**老版本 */
    if (options.q) {
      let link = decodeURIComponent(options.q);
      console.log(link);
      let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
      let id = params[0].split('=')[1]
      let spec = params[1].split('=')[1]
      let rd = params[2].split('=')[1]
      let store = params[3].split('=')[1]

      options['id'] = id || 0
      options['higher_up'] = rd || 0
      options['spec'] = spec || 0
      options['store'] = store || 0
    }
    /**新版本 */
    if (options.scene) {
      let link = decodeURIComponent(options.scene);
      let params = link.split('&')
      let id = params[0].split('=')[1]
      let spec = params[1].split('=')[1]
      let rd = params[2].split('=')[1]
      let store = params[3].split('=')[1]

      options['id'] = id || 0
      options['higher_up'] = rd || 0
      options['spec'] = spec || 0
      options['store'] = store || 0
    }

    this.data.higher_up = options.higher_up || 0
    this.data.goods_id = options.id || 0
    this.data.spec_id = options.spec || 0
    this.data.share_store = options.store || 0
    app.globalData.share_store = options.store || 0
    this.setData({
      version: app.VERSION(),
      screenHeight: app.SYSTEM_INFO().windowHeight,
      user: app.USER()
    })

    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow() {
    app.HIGHER_UP(this.data.higher_up)
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=${this.data.goods_id}&higher_up=${this.data.higher_up}&spec=${this.data.spec_id}&store=${this.data.share_store}`,
      })
    } else {
      FrontEndShop.Get({
        goods_id: this.data.goods_id,
        user_id: app.USER_ID()
      }).then(r => {
        console.log('FrontEndShop.Get => ', r)
        if (r.code == 200) {
          r.data.goods_banners = r.data.goods_banners.split(',')
          r.data.goods_img = r.data.goods_img.split(',')
          r.data.goods_spec = r.data.goods_spec.map(u => {
            u.showT = `${u.spec_size} ${u.spec_color}`
            let member_price = parseFloat(u.spec_price) - parseFloat(r.data.goods_brokerage)
            member_price = member_price < 0 ? 0 : member_price
            let member_group_price = parseFloat(u.group_price) - parseFloat(r.data.goods_brokerage)
            u.member_price = member_price.toFixed(2);
            u.member_group_price = member_group_price.toFixed(2)
            return u
          })
          r.data.goods_number = 1
          r.data.goods_limit = r.data.goods_limit || 0
          r.data.goods_spec.forEach((val, idx) => {
            if (val.id == this.data.spec_id) {
              this.setData({
                spec_chosed: idx
              })
            }
          })
          this.setData({
            goods: r.data
          })
        }
      })
      this.getEvaluate()

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
      //-- 定时器
      this.setData({
        timerid: setInterval(this.udpGroupLessTime, 1000)
      })
    }
  },
  //-- 改变收藏状态
  changeCollectShop() {
    if (this.data.goods.goods_collect == 0) {
      //-- 添加收藏
      FrontEndShop.AddCollect({
          user_id: app.USER_ID(),
          goods_id: this.data.goods.id,
          spec_id: this.data.goods.goods_spec[this.data.spec_chosed].id
        })
        .then(r => {
          app.msg(r.message)
          if (r.code == 200) {
            this.data.goods.goods_collect = 1
            this.setData({
              goods: this.data.goods
            })
          }
        })
    } else {
      //-- 取消收藏
      FrontEndShop.RemoveCollect({
          user_id: app.USER_ID(),
          goods_id: this.data.goods.id,
          spec_id: this.data.goods.goods_spec[this.data.spec_chosed].id
        })
        .then(r => {
          app.msg(r.message)
          if (r.code == 200) {
            this.data.goods.goods_collect = 0
            this.setData({
              goods: this.data.goods
            })
          }
        })
    }
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
  //-- 增加数量
  addcount: function(e) {
    let goods = this.data.goods

    if (goods.group_purchase == 0 && goods.is_gift == 1 && goods.goods_spec[this.data.spec_chosed].integral > 0) {
      app.msg('积分兑换商品一次只能兑换一个')
      return;
    }
    goods.goods_number++
      this.setData({
        goods: goods
      })
  },
  //-- 减少数量
  subcount: function(e) {
    if (this.data.goods.goods_number > 1) {
      let goods = this.data.goods
      goods.goods_number--
        this.setData({
          goods: goods
        })
    }
  },
  //-- 规格选择事件
  bindPickerChange(e) {
    this.setData({
      spec_chosed: e.currentTarget.dataset.idx
    })
  },

  //-- 获取商品评价
  getEvaluate() {
    Evaluate.ListForGoods({
      user_id: app.USER_ID(),
      goods_id: this.data.goods_id
    }).then(r => {
      console.log('Evaluate.ListForGoods => ', r)
      if (r.code == 200) {
        this.setData({
          evaluateList: r.data.filter((item, index) => index < 2).map(u => {
            u.addtime = TimeConverter.ToLocal(u.addtime)
            u.evaluate_img = u.evaluate_img && u.evaluate_img.length > 0 ? u.evaluate_img.split(',') : []
            return u
          })
        })
      }
    })
  },
  //-- 查看全部评价
  goAllEva: function() {
    if (this.data.evaluateList.length > 0) {
      wx.navigateTo({
        url: `/pages/shop/allevaluates?id=${this.data.goods_id}`,
      })
    }
  },
  //--更新剩余时间
  udpGroupLessTime() {
    clearInterval(this.data.timerid)
    let goods = this.data.goods
    if (goods.goods_group && goods.goods_group.length > 0) {
      goods.goods_group.forEach(item => {
        let short_time = item.short_time

      })
    }
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx
    })

    if (e.currentTarget.id == 0) { //-- 商品			
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
    if (e.currentTarget.id == 1) { //-- 评价
      wx.createSelectorQuery().select('#commbox').boundingClientRect().exec(res => {
        console.log('#commbox rect => ', res[0])
        wx.pageScrollTo({
          scrollTop: this.data.scrollPosition + res[0].top - 45,
        })
      })
    }
    if (e.currentTarget.id == 2) { //-- 详情
      wx.createSelectorQuery().select('#contentbox').boundingClientRect().exec(res => {
        console.log('#commbox rect => ', res[0])
        wx.pageScrollTo({
          scrollTop: this.data.scrollPosition + res[0].top - 45,
        })
      })
    }
  },
  //-- 检测是否需要付钱
  payMoneyChecked() {
    //--1. 就否为线下商铺
    let goods = this.data.goods
    if (goods.store_info.on_line == 0) {
      return false
    } else {
      let {
        service_charge
      } = goods.goods_spec[this.data.spec_chosed]
      let transport_cost = goods.store_info.transport_cost
      if (service_charge > 0 || transport_cost > 0) {
        return true
      } else {
        return false
      }
    }

  },
  checkedAddress() {
    if (this.data.goods.store_info.on_line == 0) {
      return true;
    }
    return !this.data.defaultAddress.province == false
  },
  //-- 领取赠品
  onGetGift(e) {
    if (this.checkedAddress()) {
      let goods = this.data.goods
      let spec_chosed = this.data.spec_chosed
      let spec = goods.goods_spec[spec_chosed]
      //-- 如果是赠品
      if (goods.is_gift == 1) {
        if (!this.payMoneyChecked()) {
          //-- 没有服务费或运费时，直接领取
          Order.AcGift({
              user_id: app.USER_ID(),
              goods_id: spec.goods_id,
              spec_id: spec.id,
              spec_num: 1
            })
            .then(r => {
              console.log('Order.AcGift => ', r)
              if (r.code == 200) {
								if (r.data.order_type == 3){
								Order.AfterIntegralPay({
									user_id:app.USER_ID(),
									order_id:r.data.id
								}).then(rr=>{
									console.log('Order.AfterIntegralPay => ',rr)
									if(rr.code==200){
										app.CONFIME(`领取成功，是否立即查看详情?`, () => {
											wx.navigateTo({
												url: `/pages/orders/orderdetail?id=${r.data.id}`
											})
										})
									}else{
										app.ERROR(rr.message)
									}
								}) 
								} else{
									app.CONFIME(`领取成功，是否立即查看详情?`, () => {
										wx.navigateTo({
											url: `/pages/orders/orderdetail?id=${r.data.id}`
										})
									})
								}              
              } else {
                app.ERROR(r.message)
              }
            })
        } else {
          //-- 有服务费或运费时，去生成订单
          this.jifengOrder()
        }
      } else { //-- 否则，则生成订单先
        this.directOrder()
      }
    } else {
      wx.navigateTo({
        url: `/pages/usercenter/addressmgr?fromShop=${true}`,
      })
    }
  },
  jifengOrder() {
    this.order(2)
  },
	//-- 查看软文
	toFtxt(){
		wx.navigateTo({
			url: `/pages/ftxt/detail?id=${this.data.goods.goods_ad}`,
		})
	},
  //-- 直接购买
  directOrder() {
    if (this.checkedAddress()) {
      this.order(0)
    } else {
      wx.navigateTo({
        url: `/pages/usercenter/addressmgr?fromShop=${true}`,
      })
    }
  },
  //-- 开团
  tuanOrder() {
    if (this.checkedAddress()) {
      this.order(1)
    } else {
      wx.navigateTo({
        url: `/pages/usercenter/addressmgr?fromShop=${true}`,
      })
    }
  },
  //-- 下单
  order(direct) {
    direct = direct || 0 //-- true 表示直接购买
    let chosedObj = { ...this.data.goods
    }
    chosedObj.goods_spec = { ...this.data.goods.goods_spec[this.data.spec_chosed]
    }
    chosedObj.orderDirect = direct
    chosedObj.store_info = { ...this.data.goods.store_info
    }
    wx.setStorageSync('chosedObj', chosedObj)
    wx.navigateTo({
      url: `/pages/groupbuy/grouporder`,
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/shop/index',
    })
  },
  //-- 分享到用户或群
  onShareAppMessage(res) {
    let goods = this.data.goods
    let spec_chosed = this.data.spec_chosed
    let spec = goods.goods_spec[spec_chosed]

    let title = ''
    if (goods.group_purchase == 1) {
      title = `${app.USER().nick_name}邀您一起【拼购】：${goods.goods_name}只需￥${spec.group_price}`
    } else if (goods.is_gift == 1) {
      title = `好礼免费领，还能赚佣金：${goods.goods_name}`
    } else {
      title = `${app.USER().nick_name}向您推荐：${goods.goods_name}只需￥${spec.spec_price}`
    }
    let path = `/pages/shop/details?id=${spec.goods_id}&spec=${spec.id}&higher_up=${app.USER_ID()}&store=${goods.store_id}`
    return {
      title,
      path,
      imageUrl: spec.spec_img,
      success: res => {
        console.log('ShareAppMessage.res => ', res)
        this.hideShareBox()
      }
    }
  },
  //-- 打开分享窗口
  openShareWnd: function() {
    this.setData({
      showShareWnd: true
    })
  },
  //-- 关闭分享窗口
  hideShareBox: function() {
    console.log('hideShareBox is running...')
    this.setData({
      showShareWnd: false
    })
  },
  //-- 生成海报
  shareToPYQ: function() {
    let goods = this.data.goods
    let spec_chosed = this.data.spec_chosed
    let spec = goods.goods_spec[spec_chosed]
    let small_title = `${spec.spec_size} ${spec.spec_color}`
    let content = goods.is_gift == 1 ? "免费领取" : goods.group_purchase == 1 ? `￥${spec.group_price} - ${goods.group_num}人团` : `￥${spec.spec_price}`
    let shareData = {
      img: spec.spec_img, //-- 图片
      title: goods.goods_name, //-- 标题
      small_title, //-- 小标题
      content, //-- 内容
      pageLoad: `pages/shop/details`, //-- 页面地址
      pageScene: `id=${goods.id}&idx=${spec_chosed}&rd=${app.USER_ID()}&store=${goods.store_id}`, //-- 加载页面的参数
      qrMsg: '查看详情',
      store_name: goods.store_info.store_name //-- 商铺名称
    }

    wx.setStorageSync('shareData', shareData)
    this.hideShareBox();
    wx.navigateTo({
      url: '/pages/sharepyq/sharepyq',
    })
  },
  onPageScroll(e) {
		if (e.scrollTop >= 1000 && !this.data.showToTop) {
			this.setData({
				showToTop: true
			})
		}
		if (e.scrollTop < 1000 && this.data.showToTop) {
			this.setData({
				showToTop: false
			})
		}
    this.data.scrollPosition = e.scrollTop
    wx.createSelectorQuery().select('#commbox').boundingClientRect().exec(res => {
      let r = res[0]
      if (r.top >= this.data.screenHeight - 44) {
        this.setData({
          classNavActIdx: 0
        })
      }
      if (r.top < this.data.screenHeight - 44 && r.top >= 44) {
        this.setData({
          classNavActIdx: 1
        })
      }
      if (r.top < 44) {
        this.setData({
          classNavActIdx: 2
        })
      }
    })
  }
})