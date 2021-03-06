var app = getApp()
import Shop from '../../comm/Shop.js'
import Index from '../../comm/Index.js'
var pageObj = {
  data: {
    version: '',
    user: {},
    sortTypeList: [{
      key: '距离',
      value: 1
    }, {
      key: '上架时间',
      value: 2
    }, {
      key: '价格',
      value: 3
    }, {
      key: '销量',
      value: 4
    }, {
      key: '综合',
      value: 5
    }],
    shopListWhere: {
			goods_type: 3, //-- 价格区间
      sort_type: 5, //-- 排序方式：0：没有排序1:距离2：上架时间3：价格4：销量5：综合排序
      user_location: '', //-- 用户位置坐标
      sort_way: 1, //排序类型：1：升序0：降序，默认1,
      page: 1,
			num: 50
    },
    index_banner: [],
    location: '',
    giftList: [],
    sc: 0,
  },
  swiperChange: function(e) {
    this.setData({
      sc: e.detail.current
    })
  },
  swiperChange2: function(e) {
    this.setData({
      sc2: e.detail.current
    })
  },
	//-- 转至会员页
	toBeMember() {
		wx.navigateTo({
			url: '/pages/usercenter/bemember',
		})
	},
  //--进入到搜索页面
  inputFocus: function() {
    wx.navigateTo({
      url: '/pages/shop/search',
    })
  },
	//-- 去详情页
	goDetail(e) {
		let goods_id = e.currentTarget.dataset.goodsid
		let spec_id = e.currentTarget.dataset.specid

		wx.navigateTo({
			url: `/pages/shop/details?id=${goods_id}&spec=${spec_id}`,
		})
	},
  //-- 排序点击事件
  onShortTypeClick(e) {
    this.data.shopListWhere.sort_type = e.currentTarget.id
		this.data.shopListWhere.page_num = 1
		this.data.shopListWhere.user_id=app.USER_ID()
    this.setData({
      shopListWhere: this.data.shopListWhere
    }, this.loadRecommendData)
  },
  //-- 商品点击事件:跳转至详情页
  onShopClick(e) {
    let id = e.currentTarget.dataset.id
    let spec = e.currentTarget.dataset.spec
    let url = `/pages/shop/details?id=${id}&spec=${spec}`
    wx.navigateTo({
      url
    })
  },
  //-- 加载推荐数据
  loadRecommendData() {
    //-- 积分商品
		Index.IntegralGoods(this.data.shopListWhere).then(r => {
			console.log('Index.IntegralGoods => ', r)
      if (r.code == 200 && r.data.length>0) {
				let giftlist = this.data.giftlist
				if (this.data.shopListWhere.page > 1) {
					giftlist = [...giftlist, ...r.data]
				} else {
					giftlist = [...r.data]
				}
        this.setData({
					giftList: giftlist
				})
			} else {
				if (this.data.shopListWhere.page > 1) {
					this.data.shopListWhere.page--
					app.msg("没有更多了~~")
				}
			}
    })
  },
  //-- 页面加载事件
  onLoad: function(options) {
		this.data.shopListWhere.user_id = app.USER_ID()
    app.HIGHER_UP(options.higher_up || 0)
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
      shop_list: [],
			shopListWhere: this.data.shopListWhere
    })
    //-- 获取轮番图数据  V1.X
    app.getBanner(res => {
      if (res.data.data.index_banner) {
        this.setData({
          index_banner: res.data.data.index_banner.map(u => {
            u.UpFilePathInfo = app.joinPath(app.globalData.baseUrl, u.UpFilePathInfo)
            return u;
          })
        })
      }
    })
  },
  //-- 每次进入页面触发
  onShow() {
    //-- 刷新当前位置 V2.X
    app._localAddress().then(r => {
      console.log('_localAddress => ', r)
      if (r.area && r.area.length > 0) {
        let len = r.area.length - 1
				let local = app.LOCATION()
				let long_lat = `${local.longitude},${local.latitude}`
				this.data.shopListWhere.user_location = long_lat
        this.setData({
          location: r.area[len],
					shopListWhere: this.data.shopListWhere
        })
      }
			this.loadRecommendData()
    })
  },
  //-- 赠品首页
	toGiftIndex() {
		wx.navigateTo({
			url: '/pages/shop/giftIndex',
		})
	},
	toJiFengPage() {
		wx.navigateTo({
			url: '/pages/shop/jifengIndex',
		})
	},
  //-- 拼团首页
  toGroupIndex() {
    wx.navigateTo({
      url: '/pages/groupbuy/index',
    })
  },
	//-- 推广首页
	toTaskIndex() {
		wx.navigateTo({
			url: '/pages/shop/taskindex',
		})
	},
  //--2.X 转向我的账户
  toMyBalance() {
    wx.navigateTo({
      url: '/pages/usercenter/balance',
    })
  },
	//-- 返回首页
	toHomeIndex(){
		wx.switchTab({
			url: '/pages/shop/index',
		})
	},
	onReachBottom() {
		console.log('============= 上拉事件发生了 =============')
		this.data.shopListWhere.page++
		this.loadRecommendData()
	}
}
import pageex from "../../utils/pageEx.js"

pageex(pageObj)

Page(pageObj)