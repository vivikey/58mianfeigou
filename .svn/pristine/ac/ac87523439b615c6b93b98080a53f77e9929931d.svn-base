import smallmenuevent from '../../template/smallmenu/smallmenu.js'
import StoreObj from '../../utils/util.js'
var app = getApp()
Page({
    data: {
        usingComment: false,
        usingSC: false,
        smallmenuclosed: true,
        present: {},
        present_id: 0,
        commentList: [],
        store: {},
        store_ex: {},
        owner: false,
        integral: 0,
        sc: 0,
        playing: 0,
        videoContext: null,
        type:1
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    onLoad: function(options) {
        if (options.rec_token)
            app.globalData.rec_token = options.rec_token

        if (options.q) {
            var link = decodeURIComponent(options.q);
            console.log(link);
            var params = link.split('?')[1]
            var id = params.split('=')[1]
            options['id'] = id
        }

        let type=options.type || 1
        if (!app.globalData.user) {
            app.globalData.showPage = `/pages/shop/details?id=${options.id}&rec_token=${options.rec_token}&type=${type}`
            app.Launch('/pages/index/index')
        }

        this.setData({
            present_id: options.id,
            commentList: [],
            type:type
        })
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    //-- 播放视频
    beginPlayVideo: function() {
        this.videoContext = wx.createVideoContext('myVideo')
        this.setData({
            playing: 1
        })
        this.videoContext.play()
    },
    //--  退出视频
    exitPlayVideo: function() {
        this.videoContext.pause()
        this.setData({
            playing: 0
        })
    },
    attention: function() {
        var store = this.data.store
        if (store.is_attention == 1) {
            app.removeAOC(2, store.store_id, res => {
                console.log(res.data)
                this.initStore()
            })
        } else {
            app.addAOC(2, store.store_id, res => {
                console.log(res.data)
                this.initStore()
            })
        }
    },
    onShow: function() {
        this.getPresentDetails()
        this.loadNewerEva()
        wx.updateShareMenu({
            withShareTicket: true,
        })
        app.getIntegral(res => {
            var integral = parseInt(res.data.data.integral);
            this.setData({
                integral: integral
            })
        })
    },
    showBigImg: function(e) {
        wx.previewImage({
            current: this.data.present.gallery[e.currentTarget.dataset.idx],
            urls: this.data.present.gallery
        })
    },
    goAllEva: function() {
        if (this.data.commentList.length > 0) {
            wx.navigateTo({
                url: 'allevaluates?id=' + this.data.present_id,
            })
        }
    },
    getPresentDetails: function() {
        app.post('https://m.58daiyan.com/MinimallApi/getPresentDetails', {
            present_id: this.data.present_id,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude,
            token: app.userInfo().token,
            type:this.data.type
        }, res => {
            console.log('getPresentDetails:', res.data)
            if (res.data.status == 0) {
                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success: res => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }

            if (!res.data.data.description || res.data.data.description.length <= 0)
                res.data.data.description = '暂无赠品描述'
            res.data.data.description = res.data.data.description.trim()

            if (!res.data.data.use_rule || res.data.data.use_rule.length <= 0)
                res.data.data.use_rule = '暂无使用规则说明'
            res.data.data.use_rule = res.data.data.use_rule.trim()
            if(!res.data.data.image){
                res.data.data.image = '/resource/images/shangpuimg.png'
            }else if (res.data.data.image.indexOf('wxfile') >= 0)
                res.data.data.image = '/resource/images/shangpuimg.png'

            if (res.data.data.start)
                res.data.data.start = res.data.data.start.split(' ')[0]
            res.data.data.gallery = !res.data.data.gallery ? [res.data.data.image] : res.data.data.gallery.split(',')
            res.data.data.content_imgs = !res.data.data.content_imgs ? [] : res.data.data.content_imgs.split(',')
            this.setData({
                present: res.data.data
            })
            this.initStore()
        })
    },
    swiperChange: function(e) {
        this.setData({
            sc: e.detail.current
        })
    },
    //-- 初始化数据
    initStore: function() {
        var store = new StoreObj.Store(app.globalData.userInfo.token, this.data.present.store_id)
        store.Get(app.post, res => {
            var ob = res.data.data
            store.title = ob.title;
            store.rel_name = ob.rel_name;
            store.rel_phone = ob.rel_phone;
            store.rel_address = ob.rel_address;
            store.province = ob.province;
            store.city = ob.city;
            store.district = ob.district;
            store.lng = ob.lng;
            store.lat = ob.lat;
            store.logo = !ob.logo?'/resource/images/logo.png':app.joinPath(app.globalData.baseUrl, ob.logo);
            store.store_id = ob.id;
            store.pt_jieshao = ob.pt_jieshao;
            store.is_attention = ob.is_attention;
            store.business_time = ob.business_time || "--";
            var store_ex = this.data.store_ex
            store_ex.attention_num = ob.attention_num
            store_ex.message_num = ob.message_num
            store_ex.poster_num = ob.poster_num
            store_ex.present_num = ob.present_num
            this.setData({
                store: store,
                store_ex: store_ex,
                owner: ob.uid == app.userInfo().user_id
            })
        })
    },
    //-- 加载最新评价
    loadNewerEva: function() {
        app.loadEvaluatList({
            id: this.data.present_id,
            num: 2
        }, res => {
            console.log('最新2条评价:', res.data)
            if (res.data.data.evaluate) {
                this.setData({
                    commentList: res.data.data.evaluate
                })
            }
        })
    },
    //-- 收藏
    toSC: function() {
        app.addAOC(1, this.data.present_id, res => {
            console.log(res.data)
            this.getPresentDetails()
        })
    },
    undoSC: function() {
        app.removeAOC(1, this.data.present_id, res => {
            console.log(res.data)
            this.getPresentDetails()
        })
    },
    //-- 使用积分购买
    shopWithJifeng: function() {
        var present = this.data.present
        app.getIntegral(res => {
            var integral = parseInt(res.data.data.integral);
            var msg = '您的积分（' + integral + '）';
            if (integral >= present.integral) {
                app.post('https://m.58daiyan.com/MinimallApi/buy', {
                    token: app.globalData.userInfo.token,
                    present_id: this.data.present_id,
                    num: 1,
                    rec_token: app.globalData.rec_token
                }, res => {
                    if (res.data.status == 1)
                        app.msgbox({
                            title: '提示',
                            content: `花费${present.integral}积分兑换成功！已存入「我的赠品券」`,
                            showCancel: false,
                            success: res => {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/usercenter/giftlist',
                                    })
                                }
                            }
                        })
                    else
                        app.msgbox({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false,
                            success: res => {}
                        })
                })
            } else {
                msg = '对不起，' + msg + '不够！'
                app.msgbox({
                    title: '提示',
                    content: msg,
                    showCancel: false,
                    success: res => {
                        if (res.confirm) {}
                    }
                })
            }
        })

    },
    //-- 转发分享
    onShareAppMessage: function(res) {
        var oldres = res
        if(oldres.from==='button'){
            var user = app.globalData.user
            if (!user.phone || user.phone.length < 11) {
                wx.navigateTo({
                    url: '/pages/index/bindphone',
                })
                return;
            }
        }
        console.log(res.target)
        var resObj = {
            title: '赠品免费拿-' + this.data.present.title,
            path: '/pages/shop/details?id=' + this.data.present.id + '&rec_token=' + app.userInfo().token,
            imageUrl: this.data.present.image,
            success: res => {
                if (res.shareTickets) { //-- 分享到群
                    app.endSendShare(res.shareTickets[0], res => {
                        var data = {
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                            token: app.globalData.userInfo.token,
                            shareType: 1
                        }
                        app.sendShareResult(data, res => {
                            console.log('sendShareResult:', data, res.data)
                            
                            if (oldres.from === 'button' && res.data.status == 1)
                                this.shopWithJifeng()
                            if (res.data.status != 1)
                                app.msgbox({
                                    content: res.data.message,
                                    showCancel: false
                                })
                        })
                    })
                } else { //-- 分享到个人
                    if (oldres.from === 'button')
                        app.msgbox({
                            content: '只能分享到“微信好友群”才能继续兑换操作并获得积分奖励',
                            showCancel: false
                        })
                }
            }
        }
        return resObj
    },
    concatCustomer: function() {
        wx.setStorage({
            key: this.data.store.store_id,
            data: this.data.store,
        })
        wx.navigateTo({
            url: 'customer?id=' + this.data.store.store_id,
        })
    },
    showCommBigImg: function (e) {
        wx.navigateTo({
            url: 'allevaluates?id=' + this.data.present_id,
        })
    }
})