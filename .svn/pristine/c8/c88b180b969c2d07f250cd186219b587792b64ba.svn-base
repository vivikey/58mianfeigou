import smallmenuevent from '../../template/smallmenu/smallmenu.js'
var app = getApp()
Page({
    data: {
        smallmenuclosed: true,
        searchstr: '',
        beginsearch: false,
        history: [],
        products: [],
        KW: '',
        sortType: 1,
        shop_list: [],
        fromtuan: false
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    choseitem: function(e) {
        console.log(e);
        this.setData({
            searchstr: e.currentTarget.dataset.context,
            KW: e.currentTarget.dataset.context
        })
        this.beginSearching()
    },
    beginSearching: function() {
        var kw = this.data.KW
        var history = this.data.history
        if (kw.length > 0 && !history.includes(kw)) {
            history.push(this.data.KW)
            wx.setStorage({
                key: 'history',
                data: history
            })
        }
        this.setData({
            beginsearch: true,
            history: history,
            shop_list: []
        })
        this.loadSortData()

    },
    inputFocus: function() {
        this.setData({
            beginsearch: false
        })
    },
    inputBlur: function(e) {
        this.setData({
            KW: e.detail.value
        })
    },
    clearHistory: function() {
        wx.setStorage({
            key: 'clearHistory',
            data: [],
        })
        this.setData({
            history: []
        })
    },
    getSort: function(e) {
        var sortType = e.currentTarget.dataset.id;
        this.setData({
            sortType: sortType,
            shop_list: []
        })
        this.loadSortData()
    },
    //-- 按照排序规则加载数据
    loadSortData: function() {
        var sortType = this.data.sortType
        var shop_list = this.data.shop_list
        if (this.data.fromtuan) {
            app.getGroupBuyListByCat({
                token: app.globalData.userInfo.token,
                longitude: app.globalData.userInfo.longitude,
                latitude: app.globalData.userInfo.latitude,
                label: sortType,
                keyword: this.data.KW,
                num: 20,
                lastId: shop_list.length - 1 >= 0 ? shop_list[shop_list.length - 1].id : 0
            }, res => {
                console.log('shop:getPresentListByCat:', res)
                var stat = 0
                if (res.data.data.shop_list) {
                    this.setData({
                        shop_list: shop_list.concat(res.data.data.shop_list.map(u => {
                            u.label = !u.label ? [] : u.label.split(' ')
                            return u;
                        }))
                    })
                    stat = 1
                } else {
                    stat = 2
                }
            })
        } else {
            app.getPresentListByCat({
                token: app.globalData.userInfo.token,
                longitude: app.globalData.userInfo.longitude,
                latitude: app.globalData.userInfo.latitude,
                label: sortType,
                keyword: this.data.KW,
                num: 20,
                lastId: shop_list.length - 1 > 0 ? shop_list[shop_list.length - 1].id : 0
            }, res => {
                console.log('search:getPresentListByCat:', res)
                var stat = 0
                if (res.data.data.shop_list) {

                    this.setData({
                        shop_list: shop_list.concat(res.data.data.shop_list.map(u => {
                            if (u.image.indexOf('wxfile') >= 0) {
                                u.image = '/resource/images/shangpuimg.png'
                            }
                            return u;
                        }))
                    })
                    stat = 1
                } else {
                    stat = 2
                }
            })
        }
    },
    onLoad: function(options) {
        if (options.fromtuan && options.fromtuan == 1) {
            //-- 来自于拼团搜索
            this.setData({
                fromtuan: true
            })
        }
        wx.getStorage({
            key: 'history',
            success: (res) => {
                if (res.data) {
                    this.setData({
                        history: res.data
                    })
                }
            },
        })
    },
    onShow: function() {
        this.setData({
            shop_list: []
        })
    },
    onReachBottom: function() {
        console.log('onReachBottom')
        this.setData({
            showbload: 1
        })
        this.loadSortData(r => {
            this.setData({
                showbload: r
            })
        })
    }
})