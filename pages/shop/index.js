var app = getApp()
import Shop from '../../comm/Shop.js'
import Index from '../../comm/Index.js'
var pageObj = {
  data: {
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
      page_num: 1,
      limit: 99
    },
    index_banner: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    location: '',
    sortType: 2,
    shop_list: [],
    posterHotList: [],
    giftHotList: [],
    groupHotList: [],
    dynamic_list: [],
    classNavList: [],
    classNavActIdx: 0,
    msgC: 0,
    timer: 0,
    showbload: 0,
    sc: 0,
    sc2: 0,
    testHtml: `<div></div>
            <div>This is the DIV target <h1>This is the H1 target</h1></div>`
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
  //--进入到搜索页面
  inputFocus: function() {
    wx.navigateTo({
      url: '/pages/shop/search',
    })
  },
  //-- 初始化头条数据
  initDynamicList() {
    let dynamic_list = []
    for (let i = 1; i < 11; i++) {
      dynamic_list.push({
        id: i,
        user: "L**V",
        value: (Math.random() * 10).toFixed(1),
        type: "佣金"
      })
    }
    this.setData({
      dynamic_list: dynamic_list
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
    Shop.TypeList({
      class_id: 0
    }).then(r => {
      console.log('Shop.TypeList => ', r)
      r.data.forEach(item => {
        classNavList.push({
          id: item.id,
          categoryName: item.categoryName
        })
      })
      this.setData({
        classNavList: classNavList
      }, () => {
        this.loadIndexData(this.data.classNavActIdx)
      })
    })
  },
	//-- 排序点击事件
	onShortTypeClick(e){
		this.data.shopListWhere.sort_type = e.currentTarget.id
		this.setData({
			shopListWhere:this.data.shopListWhere
		})
		this.loadIndexData(this.data.classNavActIdx)
	},
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx // 索引
    })
    this.loadIndexData(e.currentTarget.id)
  },
  /**加载首页数据事件 */
  loadIndexData(classNavActIdx) {
    let id = this.data.classNavList[classNavActIdx].id
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
      elect_type: id == 0 ? 3 : 4
    }
    let local = app.LOCATION()
    data.user_location = `${local.longitude},${local.latitude}`
    Index.ListShop(data).then(r => {
      console.log('Index.ListShop => ', r)
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
    //-- 海报
    Index.GetPoster({
			user_id: app.USER_ID(), page: 1, num:6
    }).then(r => {
      console.log('Index.GetPoster => ', r)
      if (r.code == 200) {
        this.setData({
          posterHotList: r.data.map(u => {
            u.poster_imgs = u.poster_imgs.split(',')[0]
            return u;
          })
        })
      }
    })
    //-- 拼团
    Index.GetGroup({
			user_id: app.USER_ID(), page: 1, num: 10
    }).then(r => {
      console.log('Index.GetGroup => ', r)
      if (r.code == 200) {
        this.setData({
          groupHotList: r.data
        })
      }
    })
    //-- 推荐
    Index.GetShop({
			user_id: app.USER_ID(), page: 1, num: 20
    }).then(r => {
      console.log('Index.GetShop => ', r)
      if (r.code == 200) {
        this.setData({
          shop_list: r.data
        })
      }
    })
  },
  //-- 页面加载事件
  onLoad: function(options) {
    app.HIGHER_UP(options.higher_up || 0)
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
      timer: 1,
      msgC: 0,
      shop_list: []
    })
    this.initDynamicList()
  },
  //-- 每次进入页面触发
  onShow() {
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
  },
  //-- 分享转发时触发
  onShareAppMessage: function() {
    return app.SHARE_DEFAULT(1, r => {
      console.log('SHARE_SUCCESS => ', r)
    })
  },
	//-- 去往海报主页
	toPosterIndex(){
		wx.navigateTo({
			url: '/pages/poster/index',
		})
	}
}
import pageex from "../../utils/pageEx.js"

pageex(pageObj)

Page(pageObj)