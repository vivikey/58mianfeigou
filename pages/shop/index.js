var app = getApp()
import Shop from '../../comm/Shop.js'
var pageObj = {
  data: {
    version: '',
    user: {},
    userInfo: {},
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
    recommendP1: [],
    recommendP2: [],
    recommendList: [],
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
      id: -2,
      categoryName: '热门'
    }, {
      id: -3,
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
      })
    })
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx
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
    this.initClassNavList()
  },
  //-- 每次进入页面触发
  onShow: function() {
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
  //-- 分享转发时触发
  onShareAppMessage: function() {
    return app.SHARE_DEFAULT(1, r => {
      console.log('SHARE_SUCCESS => ', r)
    })
  }
}
import pageex from "../../utils/pageEx.js"
import mainnav from "../../template/mainnavbox/mainnavbox.js"
pageex(pageObj)
mainnav(pageObj)
Page(pageObj)