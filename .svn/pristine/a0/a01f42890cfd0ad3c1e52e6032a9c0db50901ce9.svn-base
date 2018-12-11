import StoreObj from '../../utils/util.js'
import smallmenuevent from '../../template/smallmenu/smallmenu.js'
import poster from "../../template/posteritem/posteritem.js"
var app = getApp()
var pageObj = {
    data: {
        smallmenuclosed: true,
        showtype: 2,
        store_id: 0,
        store: {},
        shop_list: [],
        posterList: [],
        commentList: [],
        groupbuyList: [],
        notice_list: [{
            content: '欢迎光临！'
        }, {
            content: '欢迎光临！'
        }],
        userInfo: {},
        owner: false,
        comment: '',
        store_ex: {
            attention_num: 0,
            message_num: 0,
            poster_num: 0,
            present_num: 0
        },
        myBalance: 0.00
    },
    goHomePage:function(){
        wx.switchTab({
            url: '/pages/tuijian/index',
        })
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    //-- 切换类型
    changeType: function(e) {
        this.setData({
            showtype: e.target.dataset.type
        })
        this.loadData(true)
    },
    initData1: function() {
        this.setData({
            showtype: 1
        }, () => {
            this.loadPoterList((data) => {
                if (!data || data.length <= 0) {
                    this.initData4()
                }
            })
        })
    },
    initData2: function() {
        this.setData({
            showtype: 2
        }, () => {
            this.loadGiftList((data) => {
                if (!data || data.length <= 0) {
                    this.initData1()
                }
            })
        })
    },
    initData4: function() {
        this.setData({
            showtype: 4
        }, () => {
            this.getShopList(1, (data) => {
                if (!data || data.length <= 0) {
                    this.setData({
                        showtype: 5
                    }, () => {
                        this.getShopList(0)
                    })
                }
            })
        })
    },
    //-- 加载列表数据
    loadData: function(re) {
        if (this.data.showtype == 1) {
            //-- 加载活动海报
            if (re) {
                this.setData({
                    posterList: []
                })
            }
            this.loadPoterList()
        }
        if (this.data.showtype == 2) {
            //-- 加载商品信息
            if (re) {
                this.setData({
                    shop_list: []
                })
            }
            this.loadGiftList()
        }
        if (this.data.showtype == 3) {
            //-- 加载会员发言
            this.loadCommentList()
        }
        if (this.data.showtype == 4) {
            //-- 加载团购
            if (re) {
                this.setData({
                    groupbuyList: []
                })
            }
            this.getShopList(1)
        }
        if (this.data.showtype == 5) {
            //-- 加载推荐有奖
            if (re) {
                this.setData({
                    groupbuyList: []
                })
            }
            this.getShopList(0)
        }
    },
    //-- 加关注
    addAOC: function() {
        var store = this.data.store
        app.addAOC(2, store.store_id, res => {
            if (res.data.status === 1) {
                store.is_attention = 1
                this.setData({
                    store: store
                })
            }
        })
    },
    //-- 取消关注
    removeAOC: function() {
        var store = this.data.store
        app.removeAOC(2, store.store_id, res => {
            if (res.data.status === 1) {
                store.is_attention = 0
                this.setData({
                    store: store
                })
            }
        })
    },
    //--去商铺余额详情页
    toStoreBalance: function() {
        wx.navigateTo({
            url: `balance?store_id=${this.data.store_id}&store_name=${this.data.store.title}`,
        })
    },
    //--页面加载时
    onLoad: function(options) {
        console.log('onLoad-options:', options)
        if (options.rec_token)
            app.globalData.rec_token = options.rec_token
        if (options.q) {
            var link = decodeURIComponent(options.q);
            console.log(link);
            var params = link.split('?')[1]
            var id = params.split('=')[1]
            options['id'] = id
        }
        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/store/detail?id=' + options.id + '&rec_token=' + app.userInfo().token
            app.Launch('/pages/index/index')
        }
        this.setData({
            userInfo: app.globalData.userInfo,
            store_id: options.id
        })
        this.initStore()
    },
    //-- 初始化数据
    initStore: function() {
        var store = new StoreObj.Store(app.globalData.userInfo.token, this.data.store_id)
        store.Get(app.post, res => {
            var ob = res.data.data
            console.log('Get Store:', res.data)
            store.title = ob.title;
            store.rel_name = ob.rel_name;
            store.rel_phone = ob.rel_phone;
            store.rel_address = ob.rel_address;
            store.rel_mobile = ob.rel_mobile;
            store.province = ob.province;
            store.city = ob.city;
            store.district = ob.district;
            store.lng = ob.lng;
            store.lat = ob.lat;
            if (!ob.logo) {
                store.logo = '/resource/images/logo.png'
            } else {
                if (ob.logo.indexOf('wxfile') >= 0) {
                    store.logo = '/resource/images/logo.png'
                } else {
                    store.logo = app.joinPath(app.globalData.baseUrl, ob.logo);
                }
            }
            store.store_id = ob.id;
            store.pt_jieshao = ob.pt_jieshao;
            store.is_attention = ob.is_attention;
            store.business_start_time = !ob.business_start_time ? "08:00" : ob.business_start_time;
            store.business_end_time = !ob.business_end_time ? "21:00" : ob.business_end_time;
            var store_ex = this.data.store_ex
            store_ex.attention_num = ob.attention_num
            store_ex.message_num = ob.message_num
            store_ex.poster_num = ob.poster_num
            store_ex.present_num = ob.present_num || '--'
            this.setData({
                store: store,
                store_ex: store_ex,
                owner: ob.uid == app.userInfo().user_id,
                shop_list: [],
                posterList: [],
                commentList: []
            })
            this.loadNotice()
            this.initData2()
        })
    },
    //-- 打开地图
    openMap: function() {
        var store = this.data.store
        wx.openLocation({
            latitude: parseFloat(store.lat),
            longitude: parseFloat(store.lng),
            name: this.data.store.title,
            address: this.data.store.rel_address
        })
    },
    //-- 打电话
    callPhone: function(e) {
        var ob = this.data.store
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: !ob.rel_mobile || ob.rel_mobile.length <= 0 ? ob.rel_phone : ob.rel_mobile,
        })
    },
    //-- 预览图片
    showBigImg: function(e) {
        var ds = e.target.dataset
        console.log(e)
        wx.previewImage({
            urls: this.data.posterList[ds.idx].posters,
            current: ds.src
        })
    },
    onSendComment: function() {
        var comment = this.data.comment
        if (comment.length <= 0) {
            wx.showModal({
                title: '警告',
                showCancel: false,
                confirmColor: '#50d1fe',
                content: '反馈内容不能为空！',
                success: function(res) {}
            })
            return false;
        }

        app.sendComment({
            token: app.userInfo().token,
            is_anonymous: 0,
            store_id: this.data.store.store_id,
            content: comment,
            type: 3
        }, res => {
            if (res.data.status == 1) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: '发送成功，通过审核后展示',
                    success: (data) => {
                        if (data.confirm) {
                            this.setData({
                                comment: ''
                            })
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: res.data.message
                })
            }
        })
    },
    //-- 发送发言
    sendComment: function(e) {
        var comment = e.detail.value
        this.setData({
            comment: comment
        })
    },
    //-- 加载评论列表
    loadCommentList: function() {
        var commentList = this.data.commentList
        app.request('https://m.58daiyan.com/MinimallApi/getMessageListByID/', 'POST', {
            token: app.userInfo().token,
            store_id: this.data.store.store_id,
            type: 3,
            num: 20,
            lastId: commentList.length > 0 ? commentList[commentList.length - 1].id : 0
        }, false, res => {
            console.log('loadCommentList:', res)
            if (res.data.status === 1) {
                this.setData({
                    commentList: commentList.concat(res.data.data.message_list)
                })
            }
        })
    },
    //-- 加载活动海报
    loadPoterList: function(callback) {
        var posterList = this.data.posterList
        app.request('https://m.58daiyan.com/StoreApi/getPosterListByID', 'POST', {
            token: app.globalData.userInfo.token,
            store_id: this.data.store.store_id,
            status:1,
            num: 20,
            lastId: posterList.length > 0 ? posterList[posterList.length - 1].id : 0
        }, false, res => {
            console.log('loadPosters:', res.data)
            if (res.data.data.poster_list) {
                this.setData({
                    posterList: posterList.concat(res.data.data.poster_list.map(u => {
                        u.store_id = this.data.store_id
                        return u;
                    }))
                })
            }
            if (typeof callback === 'function') {
                callback(res.data.data.poster_list)
            }
        })
    },
    //-- 获取商品信息
    loadGiftList: function(callback) {
        var shop_list = this.data.shop_list
        var id = this.data.store.store_id
        app.request('https://m.58daiyan.com/StoreApi/getPresentListByID', 'POST', {
            store_id: id,
            num: 20,
            lastId: shop_list.length > 0 ? shop_list[shop_list.length - 1].id : 0
        }, false, res => {
            console.log('获取店铺赠品：', res.data)
            if (res.data.data.shop_list) {
                let templist = shop_list.concat(res.data.data.shop_list.map(u => {
                    if (u.image.indexOf('wxfile') >= 0) {
                        u.image = '/resource/images/shangpuimg.png'
                    }
                    return u;
                }).filter(u => {
                    u.end = `${u.end}T00:00:00.000Z`;
                    let nowT = new Date()
                    return ((nowT - new Date(u.end)) < 0)
                }))
                this.setData({
                    shop_list: templist
                }, () => {
                    if (templist.length <= 0) {
                        if (typeof callback === 'function') {
                            callback(templist)
                        }
                    }
                })
            }
            if (typeof callback === 'function') {
                callback(res.data.data.shop_list)
            }
        })
    },
    //-- 加载团购产品
    getShopList: function(tuanselect, callback) {
        var groupbuyList = this.data.groupbuyList
        var id = this.data.store.store_id
        app.request('https://m.58daiyan.com/MinimallApi/getShopListByID', 'POST', {
            store_id: id,
            num: 20,
            lastId: groupbuyList.length > 0 ? groupbuyList[groupbuyList.length - 1].id : 0,
            tuanselect: tuanselect
        }, false, res => {
            console.log('获取店铺团购：', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    groupbuyList: groupbuyList.concat(res.data.data.shop_list.map(u => {
                        u.label = !u.label ? [] : u.label.split(' ')
                        return u;
                    }))
                })
            }
            if (typeof callback === 'function') {
                callback(res.data.data.shop_list)
            }
        })
    },
    //-- 加载公告
    loadNotice: function() {
        app.post('https://m.58daiyan.com/StoreApi/getNoticeListByID', {
            token: app.userInfo().token,
            store_id: this.data.store_id,
            type: 2,
            num: 10
        }, res => {
            if (res.data.data.notice_list) {
                this.setData({
                    notice_list: res.data.data.notice_list
                })
            }
        })
    },
    onShow: function() {
        app.getStoreBalance(this.data.store_id, res => {
            if (res.data.data.money) {
                this.setData({
                    myBalance: res.data.data.money
                })
            }
        })
    },
    onShareAppMessage: function() {
        console.log('logo:', this.data.store.logo)
        var resObj = {
            title: this.data.store.title,
            path: '/pages/store/detail?id=' + this.data.store.store_id + '&rec_token=' + app.userInfo().token,
            imageUrl: this.data.store.logo,
            success: res => {}
        }
        return resObj
    },
    onReachBottom: function() {
        this.loadData()
    }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
poster(pageObj, app)
Page(pageObj)