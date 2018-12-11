var app=getApp()
var pageObj={
  data: {
      sc: 0,
      sc2:0,
      user: {},
      userInfo: {},
      location: '',
      shop_list:[],
      hot_list:[],
      timer: 0,
      sortType: 2,
      showbload:0,
      index_banner:[]
  },
    swiperChange: function (e) {
        this.setData({
            sc: e.detail.current
        })
    },
    swiperChange2: function (e) {
        this.setData({
            sc2: e.detail.current
        })
    },
  onLoad: function (options) {
      app.globalData.rec_token = options.rec_token

      if (!app.globalData.user) {
          app.globalData.showPage = '/pages/groupbuy/index?rec_token=' + options.rec_token
          app.Launch('/pages/index/index')
      }
      this.setData({
          user: app.globalData.user,
          userInfo: app.globalData.userInfo,
          timer: 1,
          msgC: 0,
          shop_list: []
      })
  },
  onShow:function(){
      this.setData({
          user: app.globalData.user,
          userInfo: app.globalData.userInfo,
          timer: 1,
      })
      app.getUserLocation((latitude, longitude) => {
          app.updateUserLocation(latitude, longitude);
          app.changeLocation({
              latitude,
              longitude
          }, res => {
              console.log('changeLocation:', res)
              this.setData({
                  userInfo: app.globalData.userInfo,
                  location: res.data.data
              })
              if (this.data.shop_list.length <= 0) {
                  this.loadSortData()
              }
          })

      });
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
  toDetail:function(e){
      var id = e.currentTarget.dataset.id || 452
      wx.navigateTo({
          url: `detail?id=${id}`,
      })
  },
    //-- 设备排序规则
    getSort: function (e) {
        var sortType = e.currentTarget.dataset.id;
        this.setData({
            sortType: sortType,
            shop_list: []
        })
        this.loadSortData()
    },
    //-- 按照排序规则加载数据
    loadSortData: function (callback) {
        let sortType = this.data.sortType
        let shop_list = this.data.shop_list
        app.getGroupBuyListByCat({
            token: app.globalData.userInfo.token,
            tuanselect:1,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            label: sortType,
            keyword: '',
            num: 20,
            lastId: shop_list.length - 1 >= 0 ? shop_list[shop_list.length - 1].id : 0
        }, res => {
            console.log('shop:getPresentListByCat:', res)
            var stat = 0
            if (res.data.data.shop_list) {
                this.setData({
                    shop_list: shop_list.concat(res.data.data.shop_list.map(u => {
                        u.label = !u.label?[]:u.label.split(' ')
                        return u;
                    }))
                })
                stat = 1
            } else {
                stat = 2
            }
            if (typeof callback === 'function')
                callback(stat)
        })
    },
    onShareAppMessage: function () {
        var resObj = {
            title: app.globalData.shareTB,
            path: '/pages/groupbuy/index?rec_token=' + app.userInfo().token,
            imageUrl: app.globalData.shareImg[1],
            success: res => {
                console.log('share path:', '/pages/shop/index?rec_token=' + app.userInfo().token)
            }
        }
        return resObj
    },
    onReachBottom: function () {
        console.log('onReachBottom')
        this.setData({
            showbload: 1
        })
        this.loadSortData(r => {
            this.setData({
                showbload: r
            })
        })
    },
    //--进入到搜索页面
    inputFocus: function () {
        wx.navigateTo({
            url: '/pages/shop/search?fromtuan=1',
        })
    },
}
import pageex from "../../utils/pageEx.js"
import mainnav from "../../template/mainnavbox/mainnavbox.js"
pageex(pageObj)
mainnav(pageObj)
Page(pageObj)