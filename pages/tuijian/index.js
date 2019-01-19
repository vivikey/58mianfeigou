var app = getApp()
var pageObj ={
    data: {
        user: {},
        userInfo: {},
        sc: 0,
        index_banner:[],
        showbload:0,
        shop_list:[],
        sortType:2
    },
    //-- 设备排序规则
    getSort: function (e) {
        var sortType = e.currentTarget.dataset.id;
        this.setData({
            sortType: sortType,
            shop_list: []
        },()=>{
            this.loadSortData(false)
        })
        
    },
    swiperChange: function(e) {
        this.setData({
            sc: e.detail.current
        })
    },
    onLoad: function(options) {
        app.globalData.rec_token = options.rec_token

        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/tuijian/index?rec_token=' + options.rec_token
            app.Launch('/pages/index/index')
        }
        this.setData({
            user: app.globalData.user,
            userInfo: app.globalData.userInfo
        })

        this.loadSortData(false)
    },
    onShow: function() {
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
    //-- 按照排序规则加载数据
    loadSortData: function (pushdown,callback) {
        var shop_list = this.data.shop_list
        app.getGroupBuyListByCat({
            token: app.globalData.userInfo.token,
            tuanselect: 0,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            label: this.data.sortType,
            keyword: '',
            num: 20,
            lastId: shop_list.length - 1 >= 0 ? shop_list[shop_list.length - 1].id : 0
        }, res => {
            console.log('shop:getPresentListByCat:', res)
            var stat = 0
            if (res.data.data.shop_list) {
                if(pushdown){
                    this.setData({
                        shop_list:[]
                    })
                    this.setData({
                        shop_list: res.data.data.shop_list.map(u => {
                            u.label = !u.label ? [] : u.label.split(' ')
                            return u;
                        })
                    })
                    wx.stopPullDownRefresh()
                }else{
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
    onReachBottom: function () {
        console.log('onReachBottom')
        this.setData({
            showbload: 1
        })
        this.loadSortData(false,r => {
            this.setData({
                showbload: r
            })
        })
    },
    onPullDownRefresh:function(){
        this.loadSortData(true)
    }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)