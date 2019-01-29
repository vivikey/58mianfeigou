var app = getApp()
import ToTop from "../../utils/ToTop.js"
import Shop from '../../comm/Shop.js'
import Index from '../../comm/Index.js'
Page({
  data: {
		...ToTop.data,
    version: '',
    user: {},
    userInfo: {},
    sortTypeList: [{
      key: '距离',
      value: 1
    }, {
      key: '上架时间',
      value: 2
    }, {
      key: '佣金',
      value: 3
    }, {
      key: '销量',
      value: 4
    }, {
      key: '综合',
      value: 5
    }],
    shopListWhere: {
			goods_type: 1, //-- 
			sort_type: 5, //-- 排序方式：0：没有排序 1:距离 2：上架时间 3：价格 4：销量 5：综合排序
			user_location: '', //-- 用户位置坐标
			sort_way: 1, //排序类型：1：升序0：降序，默认1,
			page: 1,
			num: 50
    },
    index_banner: [],
    location: '',
    sortType: 2,
		taskList: [],
    sc: 0,
		higher_up:0
  },
	...ToTop.methods,
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
  //-- 排序点击事件
  onShortTypeClick(e) {
    this.data.shopListWhere.sort_type = e.currentTarget.id
		this.data.shopListWhere.page_num = 1
		this.data.shopListWhere.user_id = app.USER_ID()
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
    //-- 赠品
		Index.TaskList(this.data.shopListWhere).then(r => {
			console.log('Index.TaskList => ', r)
      if (r.code == 200 && r.data.length>0) {
				let olist = []
				let slist = r.data
				slist.forEach(item => {
					if (item.spec.length > 0) {
						item.spec.forEach(sp => {
							let obj = {
								...item
							}
							obj.spec = {
								...sp
							}
							obj.goods_key = obj.goods_key.split(/，|,/)
							olist.push({
								...obj
							})
						})
					}
				})

				let taskList = this.data.taskList
				if (this.data.shopListWhere.page > 1) {
					taskList = [...taskList, ...olist]
				} else {
					taskList = [...olist]
				}
        this.setData({
					taskList: taskList
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
			higher_up: options.higher_up || 0,
			shopListWhere: this.data.shopListWhere
		})
		//-- 获取轮番图数据  V2.X
		Index.ShowBanners({ user_id: app.USER_ID() }).then(res => {
			console.log('Index.ShowBanners => ', res)
			if (res.code == 200) {
				this.data.index_banner = res.data.map(u => {
					u.UpFilePathInfo = app.joinPath(app.globalData.xcxUrl, u.img_url)
					u.img_skip_url = u.img_skip_url || 'pages/shop/index'
					u.ad_link = '/' + u.img_skip_url
					return u;
				})
				this.setData({
					index_banner: this.data.index_banner
				})
			}
		})
  },
  //-- 每次进入页面触发
  onShow() {
		if (!app.USER()) {
			app.globalData.bkPage = this.route
			wx.navigateTo({
				url: `/pages/index/index?id=0&higher_up=${this.data.higher_up}`,
			})
		}
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
			url: '/pages/store/detail?id=51',
		})
	},
  //-- 拼团首页
  toGroupIndex() {
    wx.navigateTo({
      url: '/pages/groupbuy/index',
    })
  },
  //--2.X 转向我的账户
  toMyBalance() {
    wx.navigateTo({
      url: '/pages/usercenter/balance',
    })
  },
	//-- 返回首页
	toHomeIndex() {
		wx.switchTab({
			url: '/pages/shop/index',
		})
	},
	onReachBottom() {
		console.log('============= 上拉事件发生了 =============')
		this.data.shopListWhere.page++
		this.loadRecommendData()
	},
	//-- 分享转发时触发
	onShareAppMessage: function () {
		return app.SHARE_DEFAULT(0, r => {
			console.log('SHARE_SUCCESS => ', r)
		})
	},
})