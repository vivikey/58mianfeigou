var app = getApp()
import FrontEndShop from '../../comm/FrontEndShop.js'
import Address from '../../comm/Address.js'
import Cart from '../../comm/Cart.js'
import Order from '../../comm/Order.js'
Page({
  data: {
    version: '',
    goods_id: 0,
    spec_id: 0,
    spec_chosed: 0,
    goods: {},
    classNavList: ['商品', '评价', '详情'],
    classNavActIdx: 0,
    sc: 0,
    addressList: [],
    defaultAddress: {
      district: '请配置选择收货地址'
    },
    showShareWnd: false,
		timerid:0
  },
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
  onLoad: function(options) {
    if (options.q) {
      var link = decodeURIComponent(options.q);
      console.log(link);
      var params = link.split('?')[1]
      var id = params.split('=')[1]
      options['id'] = id
    }

    this.setData({
      goods_id: options.id || 0,
      spec_id: options.spec || 0,
      version: app.VERSION()
    })
    wx.showShareMenu({
      withShareTicket: true
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
  //-- 增加数量
  addcount: function(e) {
    let goods = this.data.goods
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
  onShow: function() {
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
			timerid:setInterval(this.udpGroupLessTime,1000)
		})
  },
	//--
	udpGroupLessTime(){		
		clearInterval(this.data.timerid)
		let goods = this.data.goods
		if (goods.goods_group && goods.goods_group.length>0){
			goods.goods_group.forEach(item=>{
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
    this.getShopOrCommList()
  },
  //-- 加入购物车
  // importToCart() {
  //   Cart.Add({
  //     user_id: app.USER_ID(),
  //     store_id: this.data.goods.store_id,
  //     spec_id: this.data.goods.goods_spec[this.data.spec_chosed].id,
  // 		spec_num: this.data.goods.goods_number
  //   }).then(r => {
  //     console.log('Cart.Add => ', r)
  //   })
  // },
  //-- 领取赠品
  onGetGift(e) {
    let goods = this.data.goods
    let spec_chosed = this.data.spec_chosed
    let spec = goods.goods_spec[spec_chosed]
    Order.AcGift({
        user_id: app.USER_ID(),
        goods_id: spec.goods_id,
        spec_id: spec.id,
        spec_num: 1
      })
      .then(r => {
        console.log('Order.AcGift => ', r)
        if (r.code == 200) {
          app.SUCCESS(r.message)
        } else {
          app.ERROR(r.message)
        }
      })
  },
  //-- 直接购买
  directOrder() {
    this.order(true)
  },
  //-- 开团
  tuanOrder() {
    this.order(false)
  },
  //-- 下单
  order(direct) {
    direct = direct || false //-- true 表示直接购买
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
  onShareAppMessage: function(res) {
		let goods = this.data.goods
		let spec_chosed = this.data.spec_chosed
		let spec = goods.goods_spec[spec_chosed]

		let title = ''
		if (goods.group_purchase == 1){
			title = `${app.USER().nick_name}邀您一起【拼购】：${goods.goods_name}只需￥${spec.group_price}`
		}else if (goods.is_gift == 1){
			title=`好礼免费领，还能赚佣金：${goods.goods_name}`
		}else{
			title = `${app.USER().nick_name}向您推荐：${goods.goods_name}只需￥${spec.spec_price}`
		}
		let path = `/pages/shop/details?id=${spec.goods_id}&spec=${spec.id}&higher_up=${app.USER_ID()}`
    return {
			title, path, imageUrl: spec.spec_img,
      success: res => {
				console.log('ShareAppMessage.res => ',res)
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
  //-- 分享到朋友圈
  shareToPYQ: function() {
		let goods = this.data.goods
		let spec_chosed = this.data.spec_chosed
		let spec = goods.goods_spec[spec_chosed]
    let shareData = {
			img: spec.spec_img, //-- 规格图片
      title: goods.goods_name, //-- 商品名称
			spec_size: spec.spec_size,//-- 规格尺寸
			spec_color: spec.spec_color, //-- 规格颜色
			group_purchase: goods.group_purchase, //-- 是否是拼团
			is_gift: goods.is_gift, //-- 是否是赠品 
			tuan_num: goods.group_num, //-- 几人团
			tuan_price: spec.group_price,//-- 拼团价
			price: spec.spec_price, //-- 商品标价
			url: `pages/shop/details`, //-- 页面地址
			id: spec.goods_id, //-- 商品ID
			choseIdx: spec_chosed, //-- 规格index
			higher_up: app.USER_ID(), //-- 推荐人ID
      qrMsg: '进入详情页',
      store_name: goods.store_info.store_name //-- 商铺名称
    }

    wx.setStorageSync('shareData', shareData)
    this.hideShareBox();
    wx.navigateTo({
      url: '/pages/sharepyq/sharepyq',
    })
  }
})