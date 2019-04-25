var app = getApp()
import FrontEndStore from '../../comm/FrontEndStore.js'
var pageObj = {
  data: {
    user: {},
    version: '',
    location: '',
    classNavList: [{
      caption: '3km',
      value: 3
    }, {
      caption: '5km',
      value: 4
    }, {
      caption: '10km',
      value: 10
    }, {
      caption: '15km',
      value: 15
    }, {
      caption: '20km',
      value: 20
    }, {
      caption: '30km',
      value: 30
    }],
    classNavActIdx: 0,
    nearByList: [],
    poster: [
      'https://xcx.58daiyan.com/static/20190124/201901241152406871.jpg',
      'https://xcx.58daiyan.com/static/20190124/201901241152408329.jpg', 'https://xcx.58daiyan.com/static/20190124/201901241152409672.jpg'
    ]
  },
  onLoad: function(options) {
    this.setData({
      version: app.VERSION(),
      user: app.USER()
    })
    this.getNearByList(this.data.classNavList[0].value)
  },
  onShow: function() {
    //-- 刷新当前位置 V2.X
    app._localAddress().then(r => {
      console.log('_localAddress => ', r)
      let pre = r.area.join('')
      this.setData({
        location: r.data.substr(pre.length)
      })
    })
  },
  //--获取附近商铺:distance - 距离
  getNearByList(distance) {
    let local = app.LOCATION()
    let long_lat = `${local.longitude},${local.latitude}`
    FrontEndStore.NearBy({
      user_id: app.USER_ID(),
      user_location: long_lat,
      distance
    }).then(r => {
      console.log('FrontEndStore.NearBy => ', r)
      if (r.code == 200) {
        this.setData({
          nearByList: r.data
        })
      }
    })
  },
  //--进入到搜索页面
  inputFocus: function() {
    wx.navigateTo({
      url: '/pages/shop/search',
    })
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx
    })
    this.getNearByList(this.data.classNavList[e.currentTarget.id].value)
  }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)