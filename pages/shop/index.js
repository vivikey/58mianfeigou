var app = getApp()
var pageObj = {
    data: {
        version:'',
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
        recommendList:[],
        dynamic_list: [],
        msgC: 0,
        timer: 0,
        showbload:0,
        sc:0,
        sc2:0
    },
    swiperChange:function(e){
        this.setData({
            sc:e.detail.current
        })
    },
    swiperChange2: function (e) {
        this.setData({
            sc2: e.detail.current
        })
    },
    //-- 跳转至签到
    toQianDao: () => {
        wx.switchTab({
            url: '/pages/credits/index'
        })
    },
    //--进入到搜索页面
    inputFocus: function() {
        wx.navigateTo({
            url: '/pages/shop/search',
        })
    },
    //-- 页面加载事件
    onLoad: function(options) {
        app.globalData.rec_token = options.rec_token

        // if (!app.globalData.user) {
        //     app.globalData.showPage = '/pages/shop/index?rec_token=' + options.rec_token
        //     app.Launch('/pages/index/index')
        // }
        this.setData({
            version:app.VERSION(),
            user: app.globalData.user,
            userInfo: app.globalData.userInfo,
            timer: 1,
            msgC: 0,
            shop_list: []
        })

        // if (!this.data.user.phone || this.data.user.phone.length < 11) {
        //     wx.navigateTo({
        //         url: '/pages/index/bindphone',
        //     })
        // }

    },
    //-- 每次进入页面触发
    onShow: function() {
        this.setData({
            user: app.globalData.user,
            userInfo: app.globalData.userInfo,
            timer: 1,
            msgC:0,
        })
        app._localAddress().then(r=>{
            console.log('_localAddress => ',r)
            if(r.area && r.area.length>0){
                let len = r.area.length-1
                this.setData({
                    location: r.area[len]
                })
            }
        })
        // app.getUserLocation((latitude, longitude) => {
        //     app.updateUserLocation(latitude, longitude);
        //     app.changeLocation({
        //         latitude,
        //         longitude
        //     }, res => {
        //         console.log('changeLocation:', res)
        //         this.setData({
        //             userInfo: app.globalData.userInfo,
        //             location: res.data.data
        //         })
        //         if (this.data.shop_list.length<=0){
        //             this.loadSortData()
        //         }
        //         app.getUnReadNum({
        //             is_store: 1,
        //             type: 1
        //         }, res => {
        //             if (res.data.status == 1) {
        //                 console.log('getUnReadNum:', res.data)
                        
        //                 if (res.data.data.first_notice) {
        //                     this.setData({
        //                         msgC: parseInt(res.data.data.count) + parseInt(this.data.msgC)
        //                     })
        //                 }                         
        //             }
        //             app.getUnReadNum({
        //                 is_store: 2,
        //                 type: 2
        //             }, res => {
        //                 console.log('平台公告:', res.data)
        //                 if (res.data.data.first_notice) {
        //                     res.data.data.first_notice.addtime = app.convertDate(res.data.data.first_notice.addtime)
        //                     this.setData({
        //                         msgC: parseInt(res.data.data.count) + parseInt(this.data.msgC)
        //                     })
        //                 }
        //                 app.getUnReadNum({
        //                     is_store: 1,
        //                     type: 2
        //                 }, r => {
        //                     console.log('商家公告:', res.data)
        //                     if (r.data.data.first_notice) {
        //                         r.data.data.first_notice.addtime = app.convertDate(r.data.data.first_notice.addtime)
        //                         this.setData({
        //                             msgC: parseInt(res.data.data.count) + parseInt(this.data.msgC)
        //                         })
        //                     } 
        //                 })
        //             })
        //         })
        //     })

        // });
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
        this.loadDynamic()
        app.getRecommend(res => {
            console.log('getRecommend:')
            if (res.data.data.recommend) {
                var recommend = res.data.data.recommend;                
                var recommendList=[];
                var recommendP1 = [];
                console.log(recommend)
                for (var i = 0; i < recommend.length; i++) {
                    recommend[i].UpFilePathInfo = app.joinPath(app.globalData.baseUrl, recommend[i].UpFilePathInfo)
                    if (recommendP1.length>=3) {
                        recommendList.push(recommendP1);
                        recommendP1=[];
                    } 
                    recommendP1.push(recommend[i])
                    if(i==recommend.length-1)
                        recommendList.push(recommendP1);
                }
                this.setData({
                    recommendList: recommendList
                })
            }
        })
    },
    //-- 加载动态
    loadDynamic: function() {
        app.getDynamic(res => {
            if (res.data.data.order_list) {
                var order_list = res.data.data.order_list;
                var dynamic_list = []
                var obj = []
                if (order_list.length < 2) {
                    obj.push(order_list[0])
                    dynamic_list.push(obj)
                } else {
                    for (var i = 0; i < order_list.length; i++) {
                        obj.push(order_list[i])
                        if (i % 2 == 1) {
                            dynamic_list.push(obj)
                            obj = []
                        }
                    }
                }
                var this_dynamic_list = this.data.dynamic_list

                if (this_dynamic_list.length <= 0 || (this_dynamic_list[0] != dynamic_list[0])) {
                    this.setData({
                        dynamic_list: dynamic_list
                    })
                }
            }
            if (this.data.timer)
                this.data.timer = setTimeout(this.loadDynamic, 5000)
        })
    },
    onHide: function() {
        this.setData({
            timer: 0
        })
    },
    onUnLoad:function(){

    },
    //-- 跳转至赠品详情
    gotoGift: function(e) {
        wx.navigateTo({
            url: `/pages/shop/details?id=${e.currentTarget.dataset.pid}`,
        })
    },
    //-- 设备排序规则
    getSort: function(e) {
        var sortType = e.currentTarget.dataset.id;
        this.setData({
            sortType: sortType,
            shop_list: []
        })
        this.loadSortData()
    },
    //-- 按照排序规则加载数据
    loadSortData: function(callback) {
        var sortType = this.data.sortType
        var shop_list = this.data.shop_list
        app.getPresentListByCat({
            token: app.globalData.userInfo.token,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            label: sortType,
            keyword: '',
            num: 20,
            lastId: shop_list.length-1>0?shop_list[shop_list.length-1].id : 0
        }, res => {
            console.log('shop:getPresentListByCat:', res)
            var stat=0
            if (res.data.data.shop_list)
            {

                this.setData({
                    shop_list: shop_list.concat(res.data.data.shop_list.map(u=>{
                        if (u.image.indexOf('wxfile')>=0){
                            u.image = '/resource/images/shangpuimg.png'
                        }
                        return u;
                    }))
                })
                stat=1
            }else{
                stat=2
            }
            if (typeof callback === 'function')
                callback(stat)
        })
    },
    onShareAppMessage: function() {
        var resObj = {
            title: app.globalData.shareTB,
            path: '/pages/shop/index?rec_token=' + app.userInfo().token,
            imageUrl: app.globalData.shareImg[1],
            success: res => {
                console.log('share path:', '/pages/shop/index?rec_token=' + app.userInfo().token)
            }
        }
        return resObj
    },
    onReachBottom:function(){
        console.log('onReachBottom')
        this.setData({
            showbload:1
        })
        this.loadSortData(r=>{
            this.setData({
                showbload: r
            })
        })
    }
}
import pageex from "../../utils/pageEx.js"
import mainnav from "../../template/mainnavbox/mainnavbox.js"
pageex(pageObj)
mainnav(pageObj)
Page(pageObj)