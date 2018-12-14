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
            user: app.USER(),
            timer: 1,
            msgC: 0,
            shop_list: []
        })
    },
    //-- 每次进入页面触发
    onShow: function() {
        this.setData({
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
    onUnLoad:function(){

    },
    onShareAppMessage: function() {
        let spath = `/pages/shop/index?rec_userid=${app.USER_ID()}`
        var resObj = {
            title: app.globalData.shareTB,
            path: spath,
            imageUrl: app.globalData.shareImg[1],
            success: res => {
                console.log('SHARE_PATH => ', spath)
            }
        }
        return resObj
    }
}
import pageex from "../../utils/pageEx.js"
import mainnav from "../../template/mainnavbox/mainnavbox.js"
pageex(pageObj)
mainnav(pageObj)
Page(pageObj)