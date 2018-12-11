var app=getApp()
Page({
  data: {
      shop_list: [],
  },
  onLoad: function (options) {
      this.loadSortData()
  },
  onShow: function () {

  },
    //-- 按照排序规则加载数据
    loadSortData: function (pushdown, callback) {
        var shop_list = this.data.shop_list
        app.getGroupBuyListByCat({
            token: app.globalData.userInfo.token,
            tuanselect: 0,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            label: 1,
            keyword: '',
            num: 20,
            lastId: shop_list.length - 1 >= 0 ? shop_list[shop_list.length - 1].id : 0
        }, res => {
            console.log('shop:getPresentListByCat:', res)
            var stat = 0
            if (res.data.data.shop_list) {
                if (pushdown) {
                    this.setData({
                        shop_list: []
                    })
                    this.setData({
                        shop_list: res.data.data.shop_list.map(u => {
                            u.label = !u.label ? [] : u.label.split(' ')
                            return u;
                        })
                    })
                    wx.stopPullDownRefresh()
                } else {
                    this.setData({
                        shop_list: shop_list.concat(res.data.data.shop_list.map(u => {
                            u.label = !u.label ? [] : u.label.split(' ')
                            return u;
                        }))
                    })
                }
                stat = 1
            } else {
                stat = 2
            }
            if (typeof callback === 'function')
                callback(stat)
        })
    },
    onPullDownRefresh: function () {
        this.loadSortData(true)
    }
})