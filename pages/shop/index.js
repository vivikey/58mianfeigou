var app = getApp()
import ToTop from "../../utils/ToTop.js"
import YuSell from "../../template/yusell/index.js"
import Shop from '../../comm/Shop.js'
import Index from '../../comm/Index.js'
Page({
  data: {
    ...ToTop.data,
		...YuSell.data,
    higher_up: 0,
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
      price_between: '0,100000', //-- 价格区间
      distance: 9000, //-- 距离
      sort_type: 5, //-- 排序方式：0：没有排序1:距离2：上架时间3：价格4：销量5：综合排序
      user_location: '', //-- 用户位置坐标
      class: '1',
      sort_way: 1, //排序类型：1：升序0：降序，默认1,
      page_num: 0,
      limit: 50
    },
    tuiJianWhere: {
      page: 1,
      num: 20
    },
    index_banner: [],
    location: '',
    sortType: 2,
    shop_list: [],
    tuijian_list: [],
    groupHotList: [],
    dynamic_list: [],
    classNavList: [],
    classNavActIdx: 0,
    sc: 0,
  },
  ...ToTop.methods,
	...YuSell.methods,
  swiperChange: function(e) {
    this.setData({
      sc: e.detail.current
    })
  },
	handleBaokuang() {
		wx.navigateTo({
			url: `baokuang`,
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
  //-- 初始化头条数据
  initDynamicList(fn) {
    Index.TouTiao({
        user_id: app.USER_ID()
      }, false)
      .then(r => {
        console.log('Index.TouTiao => ', r)
        let dynamic_list = []
        if (r.code == 200) {
          dynamic_list = r.data.map(u => {
            if (!u.nick_name) {
              u.nick_name = ""
            }
            return {
              user: `**${u.nick_name.substr(u.nick_name.length-1)}`,
              value: u.brokerage,
              type: "佣金"
            }
          })
        } else {
          for (let i = 1; i < 11; i++) {
            dynamic_list.push({
              user: "L**V",
              value: (Math.random() * 10).toFixed(1),
              type: "佣金"
            })
          }
        }
        this.data.dynamic_list = dynamic_list
        if (typeof fn === 'function') {
          fn()
        }
      })

  },
  //-- 初始化导航数据
  initClassNavList() {
    let classNavList = [{
      id: -1,
      categoryName: '推荐'
    }, {
      id: 0,
      categoryName: '上新'
    }]
    Index.TypeList({
      class_id: 0
    }, false).then(r => {
      console.log('Index.TypeList => ', r)
      r.data.forEach(item => {
        classNavList.push({
          id: item.id,
          categoryName: item.categoryName
        })
      })
			this.data.classNavList = classNavList
			this.loadIndexData(this.data.classNavActIdx)
      this.setData({
				classNavList: this.data.classNavList
      })
      
    })
  },
  //-- 排序点击事件
  onShortTypeClick(e) {
    let local = app.LOCATION()
    let long_lat = `${local.longitude},${local.latitude}`
    this.data.shopListWhere.sort_type = e.currentTarget.id
    this.data.shopListWhere.page_num = 1
    this.data.shopListWhere.user_location = long_lat
    this.loadIndexData(this.data.classNavActIdx)
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.data.tuiJianWhere.page = 1
    this.data.shopListWhere.page_num = 1
    this.data.classNavActIdx = this.data.classNavActIdx
    this.data.shop_list = []
    this.data.tuijian_list = [] // 索引
    this.loadIndexData(e.currentTarget.id)
  },
  /**加载首页数据事件 */
  loadIndexData(classNavActIdx) {
    let id = this.data.classNavList[classNavActIdx].id
    this.data.shopListWhere.page_num = 1
    if (id == -1) { //-- 推荐
      this.loadRecommendData()
    } else {
      this.loadConditionData(id)
    }

  },
  //-- 加载分类数据
  loadConditionData(id) {
    let shopListWhere = this.data.shopListWhere
    let data = { ...shopListWhere,
      user_id: app.USER_ID(),
      elect_type: id == 0 ? 3 : 4,
      class: id
    }
    let local = app.LOCATION()
    data.user_location = `${local.longitude},${local.latitude}`
    Index.ListShop(data).then(r => {
      console.log('Index.ListShop => ', r)
      wx.hideLoading()
      if (r.code == 200 && r.data.length > 0) {
        let shop_list = this.data.shop_list
        if (this.data.shopListWhere.page_num > 1) {
          shop_list = [...shop_list, ...r.data]
        } else {
          shop_list = [...r.data]
        }
        this.setData({
          shop_list: shop_list,
          classNavActIdx: this.data.classNavActIdx,
          shopListWhere: this.data.shopListWhere
        })
      } else {
        if (this.data.shopListWhere.page_num > 1) {
          this.data.shopListWhere.page_num--
            app.msg("没有更多了~~")
        }
      }
    })
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
		this.initDynamicList(() => {
			//-- 拼团
			Index.GetGroup({
				user_id: app.USER_ID(),
				page: 1,
				num: 10
			}).then(r => {
				console.log('Index.GetGroup => ', r)
				if (r.code == 200) {
					this.setData({
						groupHotList: r.data
					})
				}
				this.getTuiJianList()
			})
		})
  },
  //-- 加载推荐商品列表
  getTuiJianList(render) {
    //-- 推荐
    Index.GetShop({...this.data.tuiJianWhere,user_id:app.USER_ID()}).then(r => {
      console.log('Index.GetShop => ', r)
      wx.hideLoading()
      if (r.code == 200 && r.data.length > 0) {
        let tuijian_list = this.data.tuijian_list
        if (this.data.tuiJianWhere.page > 1) {
          tuijian_list = [...tuijian_list, ...r.data]
        } else {
          tuijian_list = [...r.data]
        }
        this.data.tuijian_list = tuijian_list
        if (render) {
          this.setData({
            tuijian_list: this.data.tuijian_list
          })
        } else {
          this.setData({
            shop_list: this.data.shop_list,
            tuijian_list: this.data.tuijian_list,
            groupHotList: this.data.groupHotList,
            dynamic_list: this.data.dynamic_list,
            classNavList: this.data.classNavList,
            classNavActIdx: this.data.classNavActIdx,
          })
        }
      } else {
        if (this.data.tuiJianWhere.page > 1) {
          this.data.tuiJianWhere.page--
            app.msg("没有更多了~~")
        }
      }
    })
  },
  //-- 页面加载事件
  onLoad(options) {

    this.data.tuiJianWhere.user_id = app.USER_ID()
    this.data.shopListWhere.user_id = app.USER_ID()
    this.data.tuiJianWhere.page = 1
    this.data.shopListWhere.page_num = 1
    this.data.version = app.VERSION()
    this.data.user = app.USER()
		this.setData({
			version: this.data.version,
			user: this.data.user
		})
  },
  //-- 每次进入页面触发
  onShow() {
    // if (!app.USER()) {
    //   app.globalData.bkPage = this.route
    //   wx.redirectTo({
    //     url: `/pages/index/index?id=0&higher_up=${this.data.higher_up}`,
    //   })
    // } else {
      wx.showLoading({
        title: '加载中...',
      })
      //-- 刷新当前位置 V2.X
      app._localAddress().then(r => {
        console.log('_localAddress => ', r)
        if (r.area && r.area.length > 0) {
          let len = r.area.length - 1
          this.setData({
            location: r.area[len]
          })
        }
      })

		this.initClassNavList()

    // }
  },
  //-- 分享转发时触发
  onShareAppMessage: function() {
    return app.SHARE_DEFAULT(0, r => {
      console.log('SHARE_SUCCESS => ', r)
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
  onReachBottom() {
    console.log('============= 上拉事件发生了 =============')
    if (this.data.classNavActIdx > 0) {
      let id = this.data.classNavList[this.data.classNavActIdx].id
      this.data.shopListWhere.page_num++
        this.loadConditionData(id)
    } else {
      this.data.tuiJianWhere.page++
        this.getTuiJianList()
    }

  },
  onReady() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调 res.hasUpdate
    })
		
    updateManager.onUpdateReady(function() {
      app.msgbox({
        title: '更新提示',
        content: '新版本已就绪，点击确定应用新版本',
        cancelText: '取消',
        confirmText: '确定',
        showCancle: true,
        success: res => {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
      app.ERROR('新版本下载失败!')
    })

		Index.ShowYuSell({
			user_id:app.USER_ID()
		},false).then(r=>{
			console.log('Index.ShowYuSell => ',r)
			if(r.data){
				this.setData({
					yusell:r.data
				},this.openYuSell)
			}
		})

		//-- 获取轮番图数据  V2.X
		Index.ShowBanners({
			user_id: app.USER_ID()
		},false).then(res => {
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
  }
})