var app = getApp()
import FrontEndShop from '../../comm/FrontEndShop.js'
import Address from '../../comm/Address.js'
import Cart from '../../comm/Cart.js'

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
    }
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
    chosedObj.goods_spec = { ...this.data.goods.goods_spec[this.data.spec_chosed]}
    chosedObj.orderDirect = direct
		chosedObj.store_info = { ...this.data.goods.store_info}
    wx.setStorageSync('chosedObj', chosedObj)
    wx.navigateTo({
      url: `/pages/groupbuy/grouporder`,
    })
  },
})