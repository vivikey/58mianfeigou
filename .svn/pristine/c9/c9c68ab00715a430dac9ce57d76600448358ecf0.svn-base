var app = getApp()
var pageObj = ({
    data: {
        open_comm: 0,
        poster_id:0,
        poster: {},
        comm_content:'',
        commentList:[],
        store:{},
        showShareWnd:false
    },
    toIndexPage:function(){
        wx.switchTab({
            url:'/pages/shop/index'
        })
    },
    //-- 打开分享窗口
    openShareWnd: function () {
        this.setData({
            showShareWnd: true
        })
    },
    //-- 关闭分享窗口
    hideShareBox: function () {
        this.setData({
            showShareWnd: false
        })
    },
    //-- 分享到朋友圈
    shareToPYQ: function () {
        let shareData = {
            img: this.data.poster.posters[0],
            title: this.data.poster.title,
            content: this.data.poster.content,
            type: 3, //-- 3:活动海报
            url: `pages/poster/detail`,
            id: this.data.poster.id,
            rec_token: app.userInfo().token,
            qrMsg: '进入详情页',
            store_name: this.data.store.title
        }

        wx.setStorageSync('shareData', shareData)
        this.hideShareBox();
        wx.navigateTo({
            url: '/pages/sharepyq/sharepyq',
        })
    },
    //-- 收起容器
    hideCommBox: function() {
        this.setData({
            open_comm: 0
        })
    },
    //-- 打开容器
    openCommbox:function(){
        let url = `/pages/poster/publishcomm?id=${this.data.poster_id}&title=${this.data.poster.title}&store_id=${this.data.poster.store_id}`;
        wx.navigateTo({
            url: url,
        })
    },
    //-- 完成输入
    overInputComm:function(e){
        this.setData({
            comm_content: e.detail.value
        })
    },

    onLoad: function(options) {
        console.log('拼团-options:', options)
        if (options.scene) {
            const scene = decodeURIComponent(options.scene).split('&')
            options.id = scene[0].split('=')[1]
            options.rec_token = scene[1].split('=')[1]
        }
        app.globalData.rec_token = options.rec_token
        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/poster/detail?id=' + options.id + '&rec_token=' + app.globalData.rec_token
            app.Launch('/pages/index/index')
        }
        this.setData({
            open_comm: options.open_comm || 0,
            poster_id:options.id
        })
        this.loadDetail(this.data.poster_id)
    },
    loadDetail: function(id) {
        app.post('https://m.58daiyan.com/MinimallApi/getPosterDetails', {
            poster_id: id,
            token:app.userInfo().token,
            longitude: app.userInfo().longitude,
            latitude: app.userInfo().latitude
        }, res => {
            if (res.data.status == 1) {
                this.setData({
                    poster: res.data.data
                })
            } else {
                app.msgbox({
                    content: res.data.message,
                    title: 'ERROR',
                    showCancel: false
                })
            }
            app.post('https://m.58daiyan.com/StoreApi/getStoreDetails', {
                store_id: this.data.poster.store_id,
                token: app.userInfo().token
            }, res => {
                console.log('store:',res.data)
                this.setData({
                    store:res.data.data
                })
            })
        })
    },
    //-- 获取评论列表
    loadComment: function() {
        let commentList = this.data.commentList
        app.post('https://m.58daiyan.com/StoreApi/getCommenListByPosterID',{
            token:app.userInfo().token,
            poster_id: this.data.poster_id,
            lastId: commentList.length > 0 ? commentList[commentList.length-1].id:0,
            num:30
        },res=>{
            console.log('loadComment:',res.data)
            if (res.data.data.comment_list && res.data.data.comment_list.length>0){
                let comment_list = res.data.data.comment_list
                this.setData({
                    commentList: commentList.concat(comment_list)
                })
            }
        })
    },
    //-- 打电话
    callPhone: function (e) {
        var ob = this.data.store
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: !ob.rel_mobile || ob.rel_mobile.length <= 0 ? ob.rel_phone : ob.rel_mobile,
        })
    },
    //-- 点赞
    doLike: function(e) {
        let poster = this.data.poster
        app.doLike(poster.id, res => {
            if (res.data.status == 1) {
                poster.is_like = 1
                poster.like_count++
                    this.setData({
                        poster: poster
                    })
            } else {
                app.msg(res.data.message)
            }
        })
    },
    //-- 取消点赞
    donotLike: function(e) {
        let poster = this.data.poster
        app.donotLike(poster.id, res => {
            if (res.data.status == 1) {
                poster.is_like = 0
                poster.like_count--
                    this.setData({
                        poster: poster
                    })
            } else {
                app.msg(res.data.message)
            }
        })
    },
    onShow: function() {
        this.setData({
            commentList: []
        })
        this.loadComment()
    },
    onShareAppMessage: function() {
        var resObj = {
            title: `${this.data.poster.title}`,
            path: '/pages/poster/detail?id=' + this.data.poster_id,
            imageUrl: this.data.poster.posters[0],
            success: res => {

            }
        }
        return resObj
    },
    onReachBottom:function(){
        this.loadComment()  
    }
})
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)