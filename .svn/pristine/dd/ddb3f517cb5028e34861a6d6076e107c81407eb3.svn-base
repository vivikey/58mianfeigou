import smallmenuevent from '../../template/smallmenu/smallmenu.js'
var app = getApp()

Page({
    data: {
        smallmenuclosed: true,
        user: null,
        userInfo: null,
        order_list: [],
        tuanselect: 2,
        sortType: 0,
        myCoupons:[]
    },
    toGiftQRDetail:function(e){
        app.globalData.currGift = this.data.myCoupons[e.currentTarget.dataset.idx]
        wx.navigateTo({
            url: '/pages/usercenter/usegift',
        })
    },
    loadCoupons: function() {
        let myCoupons = []
        this.getMyCoupons(5, res => {
            console.log("myCoupons 5:", res.data)
            if (res.data.data.data) {
                myCoupons = res.data.data.data.map(u => {
                    u.start_time = u.start_time.split(' ')[0]
                    u.end_time = u.end_time.split(' ')[0]
                    u.evaluation_state = !u.evaluation_state ? 0 : u.evaluation_state
                    if (u.state == 1) {
                        let endT = new Date(u.end_time + 'T23:59:59.000Z')
                        let nowT = new Date()
                        let span = nowT - endT
                        if (span > 0) {
                            u.state = 3
                        }
                    }
                    return u;
                }).filter(u=>u.state==1)
            }
            this.getMyCoupons(6, r => {
                console.log("myCoupons 6:", r.data)
                if (r.data.data.data) {
                    myCoupons = myCoupons.concat(r.data.data.data.map(u => {
                        u.start_time = u.start_time.split(' ')[0]
                        u.end_time = u.end_time.split(' ')[0]
                        u.evaluation_state = !u.evaluation_state ? 0 : u.evaluation_state
                        if (u.state == 1) {
                            let endT = new Date(u.end_time + 'T23:59:59.000Z')
                            let nowT = new Date()
                            let span = nowT - endT
                            if (span > 0) {
                                u.state = 3
                            }
                        }
                        return u;
                    }).filter(u => u.state == 1))
                }

                this.setData({
                    myCoupons: myCoupons
                })
            })
        })
    },
    //-- 获取赠品列表
    getMyCoupons: function(type, callback) {
        app.post('https://m.58daiyan.com/MinimallApi/myCoupons', {
            token: app.userInfo().token,
            type: type,
            num: 999
        }, callback)
    },
    //-- 去推荐
    toTuijian: function(e) {
        wx.navigateTo({
            url: '/pages/tuijian/detail?id=' + e.currentTarget.dataset.sid,
        })
    },
    getSort: function(e) {
        console.log(e)
        let sortType = e.currentTarget.dataset.id,
            tuanselect = e.currentTarget.dataset.ts;
        this.setData({
            sortType: sortType,
            tuanselect: tuanselect,
            order_list: []
        })
        this.getOrderList()
    },
    onLoad: function(options) {
        let sortType = options.sortType || 0
        let tuanselect = options.tuanselect || 2
        this.setData({
            sortType: sortType,
            tuanselect: tuanselect,
            user: app.globalData.user,
            userInfo: app.globalData.userInfo
        })
    },
    toStoreDetail: function(e) {
        wx.navigateTo({
            url: '/pages/store/detail?id=' + e.currentTarget.dataset.id,
        })
    },
    toPinjia: function(e) {
        var order_list = this.data.order_list
        var order_idx = e.currentTarget.dataset.idx
        wx.setStorageSync('currTuanOrder', order_list[order_idx])
        wx.navigateTo({
            url: 'comment?is_tuan=1',
        })
    },
    //-- 取消订单
    cancelOrder: function(e) {
        app.msgbox({
            content: "确定要取消此订单吗？",
            showCancel: true,
            success: d => {
                if (d.confirm)
                    app.cancelOrder(e.currentTarget.dataset.id, res => {
                        if (res.data.status == 1) {
                            app.msg("已取消")
                        } else {
                            app.msgbox({
                                content: res.data.message,
                                showCancel: false
                            })
                        }
                        this.getOrderList()
                    })
            }
        })
    },
    //-- 删除订单
    removeOrder: function(e) {
        let idx = e.currentTarget.dataset.idx
        app.msgbox({
            content: "删除后无法恢复，确定要删除此订单吗？",
            showCancel: true,
            success: d => {
                if (d.confirm)
                    app.removeOrder(e.currentTarget.dataset.id, res => {
                        if (res.data.status == 1) {
                            app.msg("已删除")
                            let order_list = this.data.order_list
                            order_list.splice(idx, 1)
                            this.setData({
                                order_list: order_list
                            })
                        } else {
                            app.msgbox({
                                content: res.data.message,
                                showCancel: false
                            })
                        }
                        this.getOrderList()
                    })
            }
        })
    },
    //-- 订单详情
    toOrderDetail: function(e) {
        var order_list = this.data.order_list
        var order_idx = e.currentTarget.dataset.idx
        wx.setStorageSync('currTuanOrder', order_list[order_idx])
        wx.navigateTo({
            url: '/pages/groupbuy/orderdetail?order_no=' + e.currentTarget.dataset.cn,
        })
    },
    //-- 获取订单列表
    getOrderList: function(reload) {
        app.post('https://m.58daiyan.com/UsersApi/getOrderList', {
            token: app.userInfo().token,
            order_from: 5,
            tuanselect: this.data.tuanselect,
            status: this.data.sortType,
            lastId: 0,
            num: 999
        }, res => {
            console.log("getOrderList:", res.data)
            if (res.data.data.order_list) {
                if (reload) {
                    this.setData({
                        order_list: []
                    })
                }
                this.setData({
                    order_list: res.data.data.order_list.map(u => {
                        if (u.order_state == 10) {
                            u.stat = 0;
                            u.statMsg = '待付款'
                        } else if (u.order_state == 20 || u.order_state == 30) {
                            if (u.tuanselect == 1 && u.tuan_is_success == 0) {
                                u.stat = 2;
                                u.statMsg = '拼团中'

                            } else {
                                u.stat = 1;
                                u.statMsg = '待消费'
                            }

                        } else if (u.order_state == 40) {
                            u.stat = 3;
                            u.statMsg = '已消费'
                        } else {
                            u.stat = -1;
                            u.statMsg = '已取消'
                        }
                        return u;
                    })
                })
            }
        })
    },
    onShow: function() {
        this.getOrderList(true)
        this.loadCoupons()
    }
})