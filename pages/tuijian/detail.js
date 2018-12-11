var app = getApp()
import StoreObj from '../../utils/util.js'
var pageObj = {
    data: {
        showToTop: false,
        shop_id: 0,
        goods: {},
        sc: 0,
        remaining: {
            d: 0, //-- 剩余天数
            h: 0, //-- 剩余小时数
            m: 0, //-- 剩余分钟数
            s: 0 //-- 剩余秒数
        },
        commentList: [],
        timer: 0,
        timer2: 0,
        store: {},
        store_ex: {},
        owner: false,
        showShareWnd: false,
        shopMode: {},
        qualification: 0,
        groupbuyList: [],
        text1: '试一试！',
        text2: '你能获得几份',
        text3: '荐三送一',
        text0: 'A'
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
        let title = `${this.data.text1}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}${this.data.shopMode.title.substr(0, 9)}...${this.data.text3}`
        if (this.data.text0 == 'B')
            title = `${this.data.text1}${this.data.shopMode.title.substr(0, 9)}...${this.data.text3}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}`
        let shareData = {
            img: this.data.shopMode.image,
            title: title,
            content: this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_spec,
            type: 2, //-- 2:推荐有奖产品
            tuan_num: this.data.goods.tuan_num,
            tuan_price: this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price_tuan,
            price: this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price,
            url: `pages/tuijian/detail`,
            id: this.data.shop_id,
            choseIdx: this.data.shopMode.chosedIdx,
            rec_token: app.userInfo().token,
            action_name:this.data.goods.recommend_action.action_name,
            award_ratio:`${this.data.goods.recommend_action.award_ratio}%`,
            qrMsg: '进入详情页',
            store_name:this.data.store.title
        }

        wx.setStorageSync('shareData', shareData)
        this.hideShareBox();
        wx.navigateTo({
            url: '/pages/sharepyq/sharepyq',
        })
    },
    //-- 获取推荐资格
    getTuijianQualification: function() {
        app.getTuijianQualification(this.data.shop_id,res => {
            console.log('Qualification:', res.data)
            if (res.data.status == 1) {
                this.setData({
                    qualification: res.data.data
                })
            }
        })
    },
    //-- 加载最新评价
    loadNewerEva: function() {
        app.loadEvaluatList({
            id: this.data.shop_id,
            num: 2,
            type: 1
        }, res => {
            console.log('最新2条评价:', res.data)
            if (res.data.data.evaluate) {
                this.setData({
                    commentList: res.data.data.evaluate
                })
            }
        })
    },
    //-- 推荐有奖产品
    getShopList: function() {
        var groupbuyList = this.data.groupbuyList
        var id = this.data.goods.store_id
        app.request('https://m.58daiyan.com/MinimallApi/getShopListByID', 'POST', {
            store_id: id,
            num: 20,
            lastId: groupbuyList.length > 0 ? groupbuyList[groupbuyList.length - 1].id : 0,
            tuanselect: 0
        }, false, res => {
            console.log('getShopList：', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    groupbuyList: groupbuyList.concat(res.data.data.shop_list.map(u => {
                        u.label = !u.label ? [] : u.label.split(' ')
                        u.distance = this.data.goods.distance
                        //-- 排除当前产品
                        return u;
                    }).filter(u => u.id != this.data.shop_id))
                })
            }
        })
    },
    swiperChange: function(e) {
        this.setData({
            sc: e.detail.current
        })
    },
    onLoad: function(options) {
        console.log('推荐有奖-options:', options)
        if (options.scene) {
            const scene = decodeURIComponent(options.scene).split('&')
            options.id = scene[0].split('=')[1]
            options.rec_token = scene[1].split('=')[1]
        }
        app.globalData.rec_token = options.rec_token
        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/tuijian/detail?id=' + options.id + '&rec_token=' + app.globalData.rec_token
            app.Launch('/pages/index/index')
        }
        var shopModel = this.data.shopMode
        shopModel.chosedIdx = options.choseIdx || 0
        this.setData({
            shop_id: options.id,
            shopModel: shopModel
        })
        this.getGoodsDetail()

    },
    //-- 下单
    grouporder: function() {
        console.log(this.data.shopMode)
        wx.setStorageSync(this.data.shop_id, this.data.shopMode)
        wx.navigateTo({
            url: `/pages/groupbuy/grouporder?id=${this.data.shop_id}&store_name=${this.data.store.title}&tuijian=1&store_id=${this.data.store.store_id}`,
        })
    },
    onShow: function() {
        this.getTuijianQualification()
    },
    //-- 初始化数据
    initStore: function() {
        var store = new StoreObj.Store(app.globalData.userInfo.token, this.data.goods.store_id)
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
            store.logo = app.joinPath(app.globalData.baseUrl, ob.logo);
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
            }, this.getShopList())
        })
    },
    //-- 获取商品详情
    getGoodsDetail: function() {
        app.post('https://m.58daiyan.com/MinimallApi/getShopDetails', {
            shop_id: this.data.shop_id,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude
        }, res => {
            console.log('getGoodsDetail:', res.data)
            if (res.data.status == 1) {
                var ob = res.data.data;
                ob.content = !ob.content ? [] : ob.content.split(',')
                ob.gallery = !ob.gallery ? [] : ob.gallery.split(',')
                ob.label = !ob.label ? [] : ob.label.split(' ')
                ob.recommend_action.start_time = ob.recommend_action.start_time.split(' ')[0]
                ob.recommend_action.end_time = ob.recommend_action.end_time.split(' ')[0]
                let gifts = []
                if (ob.gifts && ob.gifts.length > 0) {
                    console.log("ob.gifts[]",ob.gifts)
                    for (let item of ob.gifts) {
                        if (gifts.length <= 0) {
                            gifts.push(item)
                        } else {
                        if( gifts.findIndex((v,i) => {
                                console.log('v:i', v,i);
                            return v.gift_id == item.gift_id
                            }) <0 ){
                                gifts.push(item) 
                            }
                        }
                        
                    }
                    ob.gifts = gifts;
                }
                this.setData({
                    goods: ob
                })
                if (ob.recommend_action.share_content) {
                    let share_texts = ob.recommend_action.share_content.split('|')
                    if (share_texts[0] == "A") {
                        this.setData({
                            text0: share_texts[0],
                            text1: share_texts[1],
                            text2: share_texts[3],
                            text3: share_texts[5]
                        })
                    }
                    if (share_texts[0] == "B") {
                        this.setData({
                            text0: share_texts[0],
                            text1: share_texts[1],
                            text2: share_texts[5],
                            text3: share_texts[3]
                        })
                    }

                }
                this.initChoseGG()
                this.initStore()
                this.loadNewerEva()

            }
        })
    },
    //-- 查看全部评价
    goAllEva: function() {
        if (this.data.commentList.length > 0) {
            wx.navigateTo({
                url: `/pages/shop/allevaluates?id=${this.data.shop_id}&type=1`,
            })
        }
    },
    showCommBigImg: function(e) {
        wx.navigateTo({
            url: `/pages/shop/allevaluates?id=${this.data.shop_id}&type=1`,
        })
    },
    //-- 已开团时间处理
    filterTuan: function(u, nowt, havtime) {
        u.ut = Date.parse(nowt) / 1000 - u.payment_time
        u.ut = havtime - u.ut
        let h = Math.floor(u.ut / 3600)
        let leshourssec = u.ut - h * 3600;
        let m = Math.floor(leshourssec / 60)
        let s = leshourssec - m * 60
        u.havtime = havtime
        u.h = h < 10 ? '0' + h : h
        u.m = m < 10 ? '0' + m : m
        u.s = s < 10 ? '0' + s : s
        u.havtext = `${u.h}:${u.m}:${u.s}`
        return u;
    },
    //-- 初始化选择规格
    initChoseGG: function() {
        var goods = this.data.goods
        var shopMode = {
            image: goods.shop_sku[0].sku_img,
            title: goods.title,
            shop_sku: goods.shop_sku,
            chosedIdx: 0,
            count: 1,
            injoin: false,
            show: false
        }
        this.setData({
            shopMode: shopMode
        })
    },
    onHide: function() {
        clearInterval(this.data.timer)
        clearInterval(this.data.timer2)
    },
    onUnload: function() {
        clearInterval(this.data.timer)
        clearInterval(this.data.timer2)
    },
    //-- 每秒钟检查有效期
    convertTime: function() {
        if (this.data.remaining.d >= 0) {
            let nowt = new Date();
            let goods = this.data.goods;
            let settime = new Date(`${goods.tuanz_endtime}T00:00:00.000Z`);
            let ts = Math.floor((settime - nowt) / 1000);
            let days = Math.floor(ts / (24 * 3600))
            let lesdaysec = ts - days * (24 * 3600);
            let hours = Math.floor(lesdaysec / 3600)
            let leshourssec = lesdaysec - hours * 3600;
            let mininute = Math.floor(leshourssec / 60)
            let sec = leshourssec - mininute * 60
            let remaining = this.data.remaining
            remaining.d = days || 0;
            remaining.h = hours || 0;
            remaining.m = mininute || 0;
            remaining.s = sec || 0;
            this.setData({
                remaining: remaining
            })
        }
    },
    //-- 分享到用户或群
    onShareAppMessage: function(res) {
        let title = `${this.data.text1}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}`
        if (this.data.text0 == 'B')
            title = `${this.data.text1}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}`

        let path = `/pages/tuijian/detail?id=${this.data.shop_id}&rec_token=${app.userInfo().token}&choseIdx=${this.data.shopMode.chosedIdx}`
        if (this.data.qualification != 1)
            path = `/pages/tuijian/detail?id=${this.data.shop_id}&choseIdx=${this.data.shopMode.chosedIdx}`
        var resObj = {
            title: title,
            path: path,
            imageUrl: this.data.shopMode.image,
            success: res => {
                this.hideShareBox()
                app.request('https://m.58daiyan.com/MinimallApi/recommend', 'POST', {
                    rec_token: app.userInfo().token,
                    shop_id: this.data.shop_id
                }, false, res => {

                })
            }
        }
        console.log('resObj:', resObj)
        return resObj
    },
     onReachBottom: function() {
        this.getShopList()
    },
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
import chosemode from "../../template/chosegoodsmode/chosemode.js"
chosemode(pageObj)
Page(pageObj)