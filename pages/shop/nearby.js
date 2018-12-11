var app = getApp()
var pageObj={
    data: {
        smallmenuclosed: false,
        user: {},
        userInfo: {},
        itemList: [],
        areas: [1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 80, 100],
        areaidx: 5,
        index_banner:[],
        showbload:0,
        sc:0
    },
    swiperChange: function (e) {
        this.setData({
            sc: e.detail.current
        })
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    onLoad: function(options) {

    },
    //-- 选择区域范围
    bindAreaChange: function(e) {
        var value = e.detail.value
        this.setData({
            areaidx: value
        })
        this.LoadNearbyStoreOnePage(false)
    },
    //-- 加关注
    addAttention: function(e) {
        var itemList = this.data.itemList
        var store_id = itemList[e.target.dataset.idx].id
        app.addAOC(2, store_id, res => {
            if (res.data.status == 1) {
                itemList[e.target.dataset.idx].is_attention = 1
                this.setData({
                    itemList: itemList
                })
            }
        })
    },
    onShow: function() {
        app.getUserLocation((latitude, longitude) => {
            app.updateUserLocation(latitude, longitude);
            app.changeLocation({
                latitude,
                longitude
            }, res => {
                console.log('changeLocation:', res)
                this.LoadNearbyStoreOnePage(false)
                this.setData({
                    userInfo: app.globalData.userInfo
                })
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
    LoadNearbyStoreOnePage: function(t,callback) {
        if(!t){
            this.setData({
                itemList:[]
            })
        }
        var itemList = this.data.itemList
        app.post('https://m.58daiyan.com/MinimallApi/getNearbyStore', {
            token: app.globalData.userInfo.token,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            distance:this.data.areas[this.data.areaidx],
            num: 20,
            lastId: itemList.length > 0 ? itemList[itemList.length - 1].id : 0
        }, res => {
            console.log(res)

            var stat=0
            if (res.data.data.store_list) {
                var list = res.data.data.store_list
                for (var i = 0; i < list.length; i++) {
                    if (list[i].logo)
                        list[i].logo = app.joinPath(app.globalData.baseUrl, list[i].logo);
                    else
                        list[i].logo = '/resource/images/logo.png'
                }
                this.setData({
                    itemList: itemList.concat(list)
                })
                stat=1
            }else{
                stat=2
            }
            if(typeof callback ==='function')
                callback(stat)
        })
    },
    onReachBottom: function () {
        console.log('onReachBottom')
        this.setData({
            showbload: 1
        })
        this.LoadNearbyStoreOnePage(true,r => {
            this.setData({
                showbload: r
            })
        })
    }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)