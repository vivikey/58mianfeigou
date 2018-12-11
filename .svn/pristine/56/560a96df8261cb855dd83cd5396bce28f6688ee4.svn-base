var app = getApp()
var pageObj = {
    data: {
        goods: {},
        shop_id: 0,
        tuan_id: 0,
        buy_users: [],
        sur_num: -1,
        timer: 0,
        timer2: 0,
        remaining: {
            d: 0, //-- 剩余天数
            h: 0, //-- 剩余小时数
            m: 0, //-- 剩余分钟数
            s: 0 //-- 剩余秒数
        },
        lesstime: {},
        tuan_pay_time: '',
        user: {},
        hasjioned: false,
        msg: '已成团',
        sc2: 0,
        timerm: 0
    },
    swiperChange2: function(e) {
        this.setData({
            sc2: e.detail.current
        })
    },
    //-- 每秒种检查已开团的有效性
    checkingTuan: function() {
        var goods = this.data.goods
        var nowt = new Date()
        var havtime = goods.shop_info.tuan_time * 60 * 60 //--得到团有效时间的秒数，如果是0则表示无限制
        if (goods.new_rs_tuan && goods.new_rs_tuan.length > 0)
            goods.new_rs_tuan = goods.new_rs_tuan.map(u => {
                return this.filterTuan(u, nowt, havtime)
            })
        this.setData({
            goods: goods
        })
    },
    onLoad: function(options) {
        console.log(options)
        app.globalData.rec_token = options.rec_token
        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/groupbuy/injoin?shop_id=' + options.shop_id + '&tuan_id=' + options.tuan_id + '&rec_token=' + app.globalData.rec_token
            app.Launch('/pages/index/index')
        }
        this.setData({
            shop_id: options.shop_id,
            tuan_id: options.tuan_id,
            user: app.globalData.user
        })
        this.getTuanInfo(true)
    },
    onHide: function() {
        clearInterval(this.data.timer)
        clearInterval(this.data.timer2)
        clearInterval(this.data.timerm)
    },
    onUnload: function() {
        clearInterval(this.data.timer)
        clearInterval(this.data.timer2)
        clearInterval(this.data.timerm)
    },
    getTuanInfo: function(showload, callback) {
        var goods = this.data.goods
        app.request('https://m.58daiyan.com/WechatApi/ctuan', 'POST', {
            token: app.userInfo().token,
            order_id: this.data.tuan_id
        }, showload, res => {
            console.log('getTuanInfo:', res.data)
            if (res.data.status == 1) {
                var users = res.data.data.buy_users
                var hasjioned = false
                for (let i = 0; i < users.length; i++) {
                    if (app.globalData.user.id == users[i].user_id) {
                        hasjioned = true;
                        break;
                    }
                }
                if (res.data.data.ctuanList) {
                    var nowt = new Date()
                    var havtime = res.data.data.shop_info.tuan_time * 60 * 60 //--得到团有效时间的秒数，如果是0则表示无限制
                    goods.new_rs_tuan = res.data.data.ctuanList.map(u => {
                        return this.filterTuan(u, nowt, havtime)
                    })
                }
                if (res.data.data.order_good)
                    goods.order_good = res.data.data.order_good
                var shop_info = res.data.data.shop_info
                shop_info.label = !shop_info.label ? [] : shop_info.label.split(' ')
                goods.shop_info = shop_info
                goods.order_info = res.data.data.order_info
                this.setData({
                    goods: goods,
                    buy_users: users,
                    sur_num: res.data.data.sur_num,
                    tuan_pay_time: res.data.data.tuan_pay_time,
                    hasjioned: hasjioned
                })
                this.initChoseGG()
                // this.convertTime()
                // this.checkingTuan()
                if (callback) {
                    callback()
                }
            } else {
                this.setData({
                    goods: null,
                    msg: res.data.message
                })
            }
        })

    },
    onShow: function() {
        this.getTuanInfo(true, () => {
            this.setData({
                timer: setInterval(this.convertTime, 1000),
                timer2: setInterval(this.checkingTuan, 1000),
                timerm: setInterval(this.getTuanInfo, 3000, false)
            })
            console.log(this.data.timer, this.data.timer2, this.data.timerm)
        })
    },
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
        u.overdue = h <= 0 && m <= 0 && s <= 0
        return u;
    },
    //-- 每秒钟检查有效期
    convertTime: function() {
        var goods = this.data.goods
        let nowt = new Date();
        var havtime = goods.shop_info.tuan_time * 60 * 60 //--得到团有效时间的秒数，如果是0则表示无限制
        var u = {
            havtime: havtime
        }
        u.ut = Date.parse(nowt) / 1000 - this.data.tuan_pay_time
        u.ut = havtime - u.ut
        let d = Math.floor(u.ut / (24 * 3600))
        let lesdaysec = u.ut - d * (24 * 3600);
        let h = Math.floor(lesdaysec / 3600)
        let leshourssec = lesdaysec - h * 3600;
        let m = Math.floor(leshourssec / 60)
        let s = leshourssec - m * 60
        u.d = d;
        u.h = h < 10 ? '0' + h : h
        u.m = m < 10 ? '0' + m : m
        u.s = s < 10 ? '0' + s : s
        console.log('现在时间：', nowt, this.data.timer)
        console.log(`remaining-成团有效期:${havtime}秒,U：`, u)
        this.setData({
            remaining: u
        })
        if (u.ut <= 0) {
            console.log('无期限，停止计时！', this.data.timer)
            clearInterval(this.data.timer)
        }
    },
    //-- 初始化选择规格
    initChoseGG: function() {
        var goods = this.data.goods
        var sku_id = goods.order_good.goods_sku
        var sku = goods.shop_info.shop_sku
        var idx = 0;
        for (let i = 0; i < sku.length; i++) {
            if (sku[i].sku_id == sku_id) {
                idx = i;
            }
        }
        var shopMode = this.data.shopMode || {}
        shopMode.image = goods.shop_info.shop_sku[idx].sku_img
        shopMode.title = goods.shop_info.title
        shopMode.shop_sku = goods.shop_info.shop_sku
        shopMode.chosedIdx = idx
        shopMode.injoin = true
        shopMode.price = goods.shop_info.shop_sku[idx].sku_price_tuan

        this.setData({
            shopMode: shopMode
        })
    },
    //-- 分享到用户或群
    onShareAppMessage: function(res) {
        var resObj = {
            title: `邀您拼团：${this.data.shopMode.title.substr(0, 10)}...￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price_tuan}`,
            path: '/pages/groupbuy/injoin?shop_id=' + this.data.shop_id + '&tuan_id=' + this.data.tuan_id + '&rec_token=' + app.userInfo().token,
            imageUrl: this.data.shopMode.image,
            success: res => {}
        }
        console.log('resObj:', resObj)
        return resObj
    },
    //-- 重开一团
    reOpenOneBuy: function() {
        wx.redirectTo({
            url: '/pages/groupbuy/detail?id=' + this.data.shop_id,
        })
    },
    //-- 我要参团
    toInjoinGroup: function() {
        var shopMode = this.data.shopMode
        shopMode.injoin = true;
        shopMode.show = true;
        this.setData({
            shopMode: shopMode
        })
    }
}

import chosemode from "../../template/chosegoodsmode/chosemode.js"
chosemode(pageObj)
Page(pageObj)