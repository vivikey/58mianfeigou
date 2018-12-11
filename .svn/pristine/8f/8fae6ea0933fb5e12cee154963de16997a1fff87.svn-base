import smallmenuevent from '../../template/smallmenu/smallmenu.js'
var app = getApp()
var pageObj={
    data: {
        smallmenuclosed: true,
        distance: 0,
        lastId: 0,
        posterList: [],
        showbload:false,
        is_init:false
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    onLoad: function(options) {
        this.initListData(true)
    },
    initListData:function(b,callback){
        this.setData({
            is_init: true,
        })
        this.loadPosterList(b,callback)
    },
    //-- 预览图片
    showBigImg:function(e){
        var ds=e.target.dataset
        wx.previewImage({
            urls: this.data.posterList[ds.idx].posters,
            current:ds.src
        })
    },
    //-- 切换距离
    changeDis: function(e) {
        this.setData({
            distance: e.target.dataset.dis,
            is_init: true
        })
        this.loadPosterList(true)
    },
    //-- 加关注 type:2
    addAttention: function(e) {
        var posterList = this.data.posterList
        var store_id = posterList[e.target.dataset.idx].store_id
        console.log(store_id)
        app.addAOC(2, store_id,res=>{
            if(res.data.status==1){
                this.setData({
                    posterList: posterList.map(u => {
                        if (u.store_id == store_id) {
                            u.is_attention = 1
                        }
                        return u
                    })
                })
            }
        })
    },
    //-- 获取海报列表
    loadPosterList: function(b,callback) {
        var posterList = this.data.posterList
        app.request('https://m.58daiyan.com/MinimallApi/getPosterList','POST', {
            token: app.globalData.userInfo.token,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            distance: this.data.distance,
            num: 10,
            lastId: posterList.length > 0 ? posterList[posterList.length-1].id:0
        }, b,res => {
            console.log('loadPosterList:', res.data) 
            if (res.data.data.poster_list) {
                var thisList = res.data.data.poster_list
                if (this.data.is_init){
                    this.setData({
                        posterList: thisList
                    })
                }else{
                    this.setData({
                        posterList: posterList.concat(thisList)
                    })
                }
            } 
            if(typeof callback === 'function')
                callback()
        })
    },
    //-- 下接到底刷新页面
    onPullDownRefresh:function(){
        this.initListData(false,()=>{
            wx.stopPullDownRefresh()
        })
    },
    //-- 上拉到底加载更多数据
    onReachBottom: function () {
        console.log('onReachBottom')
        this.setData({
            showbload: 1,
            is_init:false
        })
        this.loadPosterList(true)
    }
}
import pageex from "../../utils/pageEx.js"
import poster from "../../template/posteritem/posteritem.js"
pageex(pageObj)
poster(pageObj, app)
Page(pageObj)