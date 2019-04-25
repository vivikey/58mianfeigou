import FrontEndStore from '../../comm/FrontEndStore.js'
import Cart from '../../comm/Cart.js'
import Notice from '../../comm/Notice.js'
import UserCenter from '../../comm/UserCenter.js'
var app = getApp()
var pageObj = {
  data: {
    user: {},
    store_id: 0,
    store: {},
    showCartList: false,
    showRecomCartList: false,
    version: '',
    share_store: 0,
    noticeList: [{
      id: -1,
      notice_name: '欢迎光临本商铺',
      notice_content: '欢迎光临本商铺'
    }, {
      id: -2,
      notice_name: '新店开业，优惠大酬宾活动正在进行时',
      notice_content: '新店开业，优惠大酬宾活动正在进行时'
    }],
    classNavList: [{
        key: 0,
        val: '赠品'
      },
      {
        key: 1,
        val: '拼团'
      },
      {
        key: 2,
        val: '商品直购'
      },
      {
        key: 3,
        val: '推荐有奖'
      },
      {
        key: 4,
        val: '营业资质'
      },
      {
        key: 5,
        val: '商铺介绍'
      }
    ],
    classNavActIdx: 2,
    sortType: [{
        key: 1,
        val: '智能排序'
      },
      {
        key: 2,
        val: '最新上架'
      },
      {
        key: 3,
        val: '销量最高'
      }
    ],
    sortTypeId: 1,
    giftList: [],
    shopList: [],
    tuanList: [],
    allList: [],
    userCommList: [],
    recomShopList: [],
    storeCart: {
      cart_list: [],
      total_num: 0,
      total_price: 0,
      transport_cost: 0
    },
    recomCart: {
      cart_list: [],
      total_num: 0,
      total_price: 0,
      transport_cost: 0
    },
    showShareWnd: false,
  },
  onSortTypeClick(e) {
    this.setData({
      sortTypeId: e.currentTarget.id
    }, () => {
      this.getShopOrCommList(true)
    })
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.setData({
      classNavActIdx: e.currentTarget.id
    }, () => {
      this.getShopOrCommList(true)
    })

  },
  onShowCartListClick() {
    this.setData({
      showCartList: !this.data.showCartList
    })
  },
  onShowRecomCartListClick() {
    this.setData({
      showRecomCartList: !this.data.showRecomCartList
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/shop/index',
    })

  },
  toMyDaiBi() {
    wx.navigateTo({
      url: '/pages/my/mydaibi',
    })
  },
	handleBaokuang(){
		wx.navigateTo({
			url: `baokuang?id=${this.data.store_id}`,
		})
	},
  //--页面加载时
  onLoad: function(options) {
    /**老版本 */
    if (options.q) {
      let link = decodeURIComponent(options.q);
      console.log(link);
      let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
      let id = params[0].split('=')[1]
      let rd = params[1] ? params[1].split('=')[1] : 0
      let store = params[2] ? params[2].split('=')[1] : 0

      options['id'] = id || 0
      options['higher_up'] = rd || 0
      options['store'] = store || 0
    }
    /**新版本 */
    if (options.scene) {
      let link = decodeURIComponent(options.scene);
      let params = link.split('&')

      let id = params[0].split('=')[1]
      let rd = params[1].split('=')[1]
      let store = params[2].split('=')[1]

      options['id'] = id || 0
      options['higher_up'] = rd || 0
      options['store'] = store || 0
    }

    this.data.store_id = options.id || 0
    this.data.higher_up = options.higher_up || 0
    this.data.share_store = options.store || 0
    if (options.id == 51) {
      this.data.classNavActIdx = 0
    } else {
      this.data.classNavActIdx = 2
    }
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
      classNavActIdx: this.data.classNavActIdx
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReady() {
    if (this.data.store_id == 51) {
      wx.setNavigationBarTitle({
        title: '积分商城'
      })
      this.setData({
        noticeList: [{
          id: -1,
          notice_name: '欢迎光临积分商城',
          notice_content: '欢迎光临积分商城'
        }]
      })
    }
  },
  //-- 页面加载完成时
  onShow() {
    app.HIGHER_UP(this.data.higher_up)
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=${this.data.store_id}&higher_up=${this.data.higher_up}&store=${this.data.share_store}`,
      })
    } else {
      this.loadStoreInfo(this.data.store_id, true, () => {
        Notice.List({
            user_id: app.USER_ID(),
            store_id: this.data.store_id
          })
          .then(r => {
            console.log('Notice.List => ', r)
            if (r.code == 200) {
              this.data.noticeList = r.data
            }
            this.getShopOrCommList()
          })
      })
      UserCenter.Get({
        user_id: app.USER_ID()
      }, false).then(r => {
        console.log('UserCenter.Get => ', r)
        if (r.code == 200 && r.data.user.user_img) {
          let user = r.data.user
          if (r.data.higher) {
            user.higher = r.data.higher
          } else {
            user.higher = null
          }
          user.member = r.data.member
          app.USER(user)
          this.setData({
            user: user,
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/auth',
          })
        }
      })
    }
  },
  //-- 显示公告详情
  onShowNotice(e) {
    let idx = e.currentTarget.dataset.idx
    let item = this.data.noticeList[idx]
    if (item.id <= 0) {
      return;
    }
    wx.setStorage({
      key: 'notice',
      data: item,
      success: res => {
        wx.navigateTo({
          url: 'notice',
        })
      }
    })
  },
  //-- 打开分享窗口
  openShareWnd() {
    this.setData({
      showShareWnd: true
    })
  },
  //-- 关闭分享窗口
  hideShareBox() {
    console.log('hideShareBox is running...')
    this.setData({
      showShareWnd: false
    })
  },
  //-- 加载商铺信息
  loadStoreInfo(store_id, render, fn) {
    FrontEndStore.Get({
      user_id: app.USER_ID(),
      store_id
    }).then(r => {
      console.log('FrontEndStore.Get => ', r)
      if (r.code == 200) {
        r.data.business_license = r.data.business_license.split(',')
        r.data.store_img = r.data.store_img.split(',')
        r.data.attent_img = `/resource/icon/gz${r.data.store_attent}.png`
        this.data.store = r.data
        if (render) {
          this.setData({
            store: this.data.store
          })
        }
        if (typeof fn === 'function') {
          fn()
        }
      } else {
        app.ERROR('系统错误，请稍候重试！')
      }
    })
  },
  //-- 关注事件
  onAttent() {
    let store = this.data.store
    if (store.store_attent == 0)
      FrontEndStore.CreateAttent({
        user_id: app.USER_ID(),
        store_id: store.id
      },false).then(r => {
        console.log('FrontEndStore.CreateAttent => ', r)
        if (r.code == 200) {
          this.loadStoreInfo(store.id, true)
        }
      })
    else
      FrontEndStore.CancelAttent({
        user_id: app.USER_ID(),
        store_id: store.id
      },false).then(r => {
        console.log('FrontEndStore.CreateAttent => ', r)
        if (r.code == 200) {
          this.loadStoreInfo(store.id, true)
        }
      })
  },
  //-- 打开地图
  openMap: function() {
    var [long, lat] = this.data.store.add_info.location.split(',')
    console.log('openMap => ', long, lat)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      name: this.data.store.store_name,
      address: this.data.store.add_info.address
    })
  },
  //-- 打电话
  callPhone(e) {
    var ob = this.data.store
    wx.makePhoneCall({
      phoneNumber: ob.store_phone,
    })
  },
  //-- 预览图片
  showBigImg: function(e) {
    var ds = e.target.dataset
    console.log(e)
    wx.previewImage({
      urls: this.data.posterList[ds.idx].posters,
      current: ds.src
    })
  },
  //-- 加载网络数据
  getShopOrCommList(render) {
    const {
      store_id
    } = this.data
		const show_type = this.data.sortTypeId
    const user_id = app.USER_ID()
    //-- 赠品列表
    if (this.data.classNavActIdx == 0) {
      this.getGiftList({
        store_id,
        user_id,
				show_type
      })
    }
    //-- 拼团列表
    if (this.data.classNavActIdx == 1) {
      this.getTuanList({
        store_id,
        user_id,
				show_type
      })
    }
    //-- 直购商品列表
    if (this.data.classNavActIdx == 2) {
      this.getShopList({
        store_id,
        user_id,
				show_type
      })
    }
    //-- 推荐有奖列表
    if (this.data.classNavActIdx == 3) {
			this.getRecommList({
				store_id,
				user_id,
				show_type
			})
    }

  },
  //-- 获取赠品列表
  getGiftList(data) {
		FrontEndStore.GiftListAtView(data)
			.then(r => {
				let list = []
				if (r.code == 200 && r.data.length > 0) {
					list = r.data.map(u => {
						u.goods_key = u.goods_key.split(/，|,/)
						return u;
					})
				}
				this.setData({
					giftList: list
				})
			})
  },
  //-- 获取拼团列表
  getTuanList(data) {
    FrontEndStore.GroupListAtView(data)
      .then(r => {
        let list = []
        if (r.code == 200 && r.data.length > 0) {
          list = r.data.map(u => {
            u.goods_key = u.goods_key.split(/，|,/)
            return u;
          })
        }
        this.setData({
          tuanList: list
        })
      })
  },
  //-- 获取直购商品列表
  getShopList(data) {
    FrontEndStore.ShopListAtView(data)
      .then(r => {
        let list = []
        if (r.code == 200 && r.data.length > 0) {
          list = r.data.map(u => {
            u.goods_key = u.goods_key.split(/，|,/)
            return u;
          })
        }
        this.setData({
          shopList: list
        })
      })
  },
  //-- 获得推荐有奖列表
  getRecommList(data) {
    FrontEndStore.RecomShopList(data).then(r => {
      let shopList = []
      if (r.code == 200 && r.data.length > 0) {
        let temparr = r.data.filter(item => item.spec && item.spec.length > 0)
        temparr.forEach(item => {
          shopList.push({
            ...item,
            cart: 0
          })
        })
      }
      this.setData({
        recomShopList: shopList
      }, this.loadRecomCartList)
    })
  },
  //-- 同步购物车数据
  syncCartData() {
    let shopList = this.data.shopList
    let cartList = this.data.storeCart.cart_list
    shopList.forEach(item => {
      if (cartList) {
        let obj = cartList.find(u => u.spec_id == item.spec.id)
        if (obj) {
          item.cart = obj.spec_num
        } else {
          item.cart = 0
        }
      }
    })
    this.setData({
      storeCart: this.data.storeCart,
      shopList: shopList
    })
  },
  //-- 同步推荐有奖购物车数据
  syncRecomCartData() {
    let recomShopList = this.data.recomShopList
    let cartList = this.data.recomCart.cart_list
    recomShopList.forEach(item => {
      if (cartList) {
        let obj = cartList.find(u => u.spec_id == item.spec.id)
        if (obj) {
          item.cart = obj.spec_num
        } else {
          item.cart = 0
        }
      }
    })

    this.setData({
      recomCart: this.data.recomCart,
      recomShopList: recomShopList
    })
  },
  //-- 去详情页
  goDetail(e) {
		const { goodsid, specid } = e.currentTarget.dataset
    wx.navigateTo({
			url: `/pages/shop/details?id=${goodsid}&spec=${specid}`,
    })
  },
  //-- 加入到购物车
  importToCart(e) {
    const { idx }= e.currentTarget.dataset
    const goods = {...this.data.shopList[idx]}
    Cart.Add({
      user_id: app.USER_ID(),
      store_id: goods.store_id,
      spec_id: goods.spec.id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.Add => ', r)
      if (r.code == 200) {
        if (!r.data.cart_list) {
          r.data.cart_list = []
          r.data.total_num = 0
          r.data.total_price = 0
          r.data.transport_cost = 0
        }
        this.renderCart(r.data)
      } else {
        app.msg(`操作失败:${r.message}`)
      }
    })
  },

  //-- 生成海报
  shareToPYQ: function() {
    let shareData = {
      img: this.data.store.store_logo, //-- 图片
      title: this.data.store.store_name, //-- 标题
      small_title: this.data.store.store_addr, //-- 小标题
      content: this.data.store.store_type, //-- 内容
      pageLoad: `pages/store/detail`, //-- 页面地址
      pageScene: `id=${this.data.store.id}&rd=${app.USER_ID()}&store=${this.data.store.id}`, //-- 加载页面的参数
      qrMsg: '查看详情',
      store_name: this.data.store.store_name //-- 商铺名称
    }

    wx.setStorageSync('shareData', shareData)
    this.hideShareBox();
    wx.navigateTo({
      url: '/pages/sharepyq/sharepyq',
    })
  },
  //-- 加入到购物车
  importToCart2(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.storeCart.cart_list[idx]
    Cart.Add({
      user_id: app.USER_ID(),
      store_id: this.data.store_id,
      spec_id: goods.spec_id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.Add => ', r)
      if (r.code == 200) {
        if (!r.data.cart_list) {
          r.data.cart_list = []
          r.data.total_num = 0
          r.data.total_price = 0
          r.data.transport_cost = 0
        }
        this.renderCart(r.data)
      } else {
        app.msg(`操作失败:${r.message}`)
      }
    })
  },
  //-- 加入到购物车
  importToRecomCart2(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.recomCart.cart_list[idx]
    Cart.AddToRecom({
      user_id: app.USER_ID(),
      recom_id: goods.recom_id,
      spec_id: goods.spec_id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.AddToRecom => ', r)
      if (r.code == 200) {
        if (!r.data.cart_list) {
          r.data.cart_list = []
          r.data.total_num = 0
          r.data.total_price = 0
          r.data.transport_cost = 0
        }
        this.renderRecomCart(r.data)
      } else {
        app.msg(`操作失败:${r.message}`)
      }
    })
  },
  //-- 渲染购物车数据
  renderCart(storeCart) {
    this.data.storeCart = storeCart
    this.syncCartData()
  },
  //-- 渲染推荐有奖购物车数据
  renderRecomCart(recomCart) {
    this.data.recomCart = recomCart
    this.syncRecomCartData()
  },
  //-- 从购物车移出
  exportFromCart(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.shopList[idx]
    Cart.Sub({
      user_id: app.USER_ID(),
      store_id: goods.store_id,
      spec_id: goods.spec.id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.Add => ', r)
      if (r.code == 200) {
        this.renderCart(r.data)
      } else {
        app.msg("操作失败")
      }
    })
  },
  //-- 加入到推荐有奖购物车
  importToRecomCart(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.recomShopList[idx]
    Cart.AddToRecom({
      user_id: app.USER_ID(),
      recom_id: goods.recommend.id,
      spec_id: goods.spec.id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.AddToRecom => ', r)
      if (r.code == 200) {
        if (!r.data.cart_list) {
          r.data.cart_list = []
          r.data.total_num = 0
          r.data.total_price = 0
          r.data.transport_cost = 0
        }
        this.renderRecomCart(r.data)
      } else {
        app.msg(`操作失败:${r.message}`)
      }
    })
  },
  //-- 从推荐有奖购物车移出
  exportFromRecomCart(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.recomShopList[idx]
    Cart.SubFromRecom({
      user_id: app.USER_ID(),
      recom_id: goods.recommend.id,
      spec_id: goods.spec.id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.SubFromRecom => ', r)
      if (r.code == 200) {
        this.renderRecomCart(r.data)
      } else {
        app.msg("操作失败")
      }
    })
  },
  //-- 从购物车移出
  exportFromCart2(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.storeCart.cart_list[idx]
    Cart.Sub({
      user_id: app.USER_ID(),
      store_id: this.data.store_id,
      spec_id: goods.spec_id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.Add => ', r)
      if (r.code == 200) {
        this.renderCart(r.data)
      } else {
        app.msg("操作失败")
      }
    })
  },
  //-- 从推荐有奖购物车移出
  exportFromRecomCart2(e) {
    let idx = e.currentTarget.dataset.idx
    let goods = this.data.recomCart.cart_list[idx]
    Cart.SubFromRecom({
      user_id: app.USER_ID(),
      recom_id: goods.recom_id,
      spec_id: goods.spec_id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.SubFromRecom => ', r)
      if (r.code == 200) {
        this.renderRecomCart(r.data)
      } else {
        app.msg("操作失败")
      }
    })
  },
  //-- 加载购物车列表
  loadCartList() {
    Cart.List({
      user_id: app.USER_ID(),
      store_id: this.data.store_id
    }).then(r => {
      console.log('Cart.List => ', r)
      if (r.code == 200) {
        this.renderCart(r.data)
      } else {
        app.ERROR(`获取购物车失败：${r.message}`)

      }
    })
  },
  //-- 加载推荐有奖购物车列表
  loadRecomCartList() {
    Cart.Recom({
      user_id: app.USER_ID(),
      store_id: this.data.store_id
    }).then(r => {
      console.log('Cart.List => ', r)
      if (r.code == 200) {
        this.renderRecomCart(r.data)
      } else {
        app.ERROR(`获取推荐有奖购物车失败：${r.message}`)

      }
    })
  },
  //-- 去结算
  toCartOrder() {
    wx.navigateTo({
      url: `/pages/store/cartorder?store_id=${this.data.store_id}`,
    })
  },
  //-- 去结算
  toRecomCartOrder() {
    wx.navigateTo({
      url: `/pages/store/recomtoorder?store_id=${this.data.store_id}`,
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.store.store_name,
      path: `/pages/store/detail?id=${this.data.store.id}&higher_up=${app.USER_ID()}&store=${this.data.store.id}`,
      imageUrl: this.data.store.store_logo,
      success: res => {
        console.log('onShareAppMessage.success => ', res)
      }
    }
  }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)