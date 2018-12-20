import FrontEndStore from '../../comm/FrontEndStore.js'
import Cart from '../../comm/Cart.js'
var app = getApp()
var pageObj = {
  data: {
    store_id: 0,
    store: {},
    version: '',
    noticeList: [{
      id: 1,
      title: '欢迎光临本商铺',
      content: '欢迎光临本商铺'
    }, {
      id: 2,
      title: '新店开业，优惠大酬宾活动正在进行时',
      content: '新店开业，优惠大酬宾活动正在进行时'
    }],
    classNavList: ['赠品', '拼团', '商品', '用户评价', '营业资质', '商铺介绍'],
    classNavActIdx: 0,
    giftList: [],
    shopList: [],
    tuanList: [],
    allList: [],
    userCommList: [],
		storeCart:{
			cart_list:[],
			total_num:0,
			total_price:0,
			transport_cost:0
		},
		storeKey:''
  },
  //--页面加载时
  onLoad: function(options) {
    let store_id = options.id || 0
		this.data.storeKey = `store_${store_id}`
    this.setData({
      version: app.VERSION(),
      store_id: store_id
    })
    this.loadStoreInfo(store_id)
  },
  loadStoreInfo(store_id) {
    FrontEndStore.Get({
      user_id: app.USER_ID(),
      store_id
    }).then(r => {
      console.log('FrontEndStore.Get => ', r)
      if (r.code == 200) {
        r.data.business_license = r.data.business_license.split(',')
        r.data.store_img = r.data.store_img.split(',')
        r.data.attent_img = `/resource/icon/gz${r.data.store_attent}.png`
        this.setData({
          store: r.data
        })
      } else {
        app.ERROR('系统错误，请稍候重试！', wx.navigateBack({
          delta: 1
        }))
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
      }).then(r => {
        console.log('FrontEndStore.CreateAttent => ', r)
        if (r.code == 200) {
          this.loadStoreInfo(store.id)
        }
      })
    else
      FrontEndStore.CancelAttent({
        user_id: app.USER_ID(),
        store_id: store.id
      }).then(r => {
        console.log('FrontEndStore.CreateAttent => ', r)
        if (r.code == 200) {
          this.loadStoreInfo(store.id)
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
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx
    })
    this.getShopOrCommList()
  },
  //-- 加载网络数据
  getShopOrCommList() {
    let store_id = this.data.store_id
    if (this.data.classNavActIdx < 3) //-- ShopList
    {
      FrontEndStore.ShopList({
        user_id: app.USER_ID(),
        store_id
      }).then(r => {
        console.log('FrontEndStore.ShopList => ', r)
        if (r.code == 200) {
          let slist = r.data
          let olist = []
          let giftList = []
          let tuanList = []
          slist.forEach(item => {
            if (item.spec.length > 0) {
              item.spec.forEach(sp => {
                let obj = { ...item
                }
                obj.spec = { ...sp
                }
                obj.goods_key = obj.goods_key.split(/，|,/)
                if (obj.group_purchase == 1) {
                  tuanList.push(obj)
                } else if (obj.is_gift == 1) {
                  giftList.push(obj)
                }
                olist.push({ ...obj
                })
              })
            }
          })
          this.setData({
            shopList: olist,
            tuanList: tuanList,
            giftList: giftList,
            allList: slist
          })
        }
      })
    }
  },
  //-- 去详情页
  goDetail(e) {
    let goods_id = e.currentTarget.dataset.goodsid
    let spec_id = e.currentTarget.dataset.specid

    wx.navigateTo({
      url: `/pages/shop/details?id=${goods_id}&spec=${spec_id}`,
    })
  },
  //-- 加入到购物车
  importToCart(e) {
		let idx = e.currentTarget.dataset.idx
		let goods = this.data.shopList[idx]
		console.log(idx,goods)
    Cart.Add({
      user_id: app.USER_ID(),
      store_id: goods.store_id,
      spec_id: goods.spec.id,
      spec_num: 1
    }).then(r => {
      console.log('Cart.Add => ', r)
			if(r.code==200){
				this.renderCart(r.data)
			}else{
				app.msg("操作失败")
			}
    })
  },
	//-- 渲染购物车数据
	renderCart(storeCart){
		this.setData({
			storeCart: storeCart
		})
	},
  //-- 从购物车移出
  exportFromCart(e) {
		let idx = e.currentTarget.dataset.idx
		let goods = this.data.shopList[idx]
		console.log(idx, goods)
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
  onShow: function() {
		let cart = wx.getStorageSync(this.data.storeKey) || []
    this.getShopOrCommList()
  },
  onShareAppMessage: function() {
    console.log('logo:', this.data.store.logo)
    var resObj = {
      title: this.data.store.title,
      path: '/pages/store/detail?id=' + this.data.store.store_id + '&rec_token=' + app.userInfo().token,
      imageUrl: this.data.store.logo,
      success: res => {}
    }
    return resObj
  }
}
Page(pageObj)