var app = getApp()
Page({
    data: {
        user: {},
        storeId: 0,
        title: "",
        uid: 0,
        currGift: {
            startdate: '2018-08-01',
            date: '2018-09-01'
        },
        historyList: [],
        thistoryList:[],
        shop_list: [],
        tshop_list: [],
        sortType: 1
    },
    getSort: function(e) {
        this.setData({
            sortType: e.detail.value
        })
    },
    onLoad: function(options) {
        let today = new Date()
        var currGift = this.data.currGift
        currGift.date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()+1}`
        currGift.startdate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        this.setData({
            storeId: options.id,
            title: options.title,
            currGift: currGift,
            uid: options.uid,
            user: app.globalData.user,
        })
    },
    onReady: function() {
        this.loadChoseData()
    },
    loadChoseData: function() {
        this.setData({
            historyList: [],
            shop_list: [],
            tshop_list: []
        }, () => {
            //-- 免费赠品
            this.loadHistory(5, res => {
                console.log('loadHistory:', res.data)
                if (res.data.data.data)
                    this.setData({
                        historyList: res.data.data.data
                    })
            })
            //-- 拼团
            this.loadScanQrHis(1, res => {
                console.log('loadScanQrHis:', res.data)
                if (res.data.data.shop_list)
                    this.setData({
                        tshop_list: res.data.data.shop_list
                    })
            })
            //-- 推荐有奖
            this.loadScanQrHis(0, res => {
                console.log('loadScanQrHis:', res.data)
                if (res.data.data.shop_list)
                    this.setData({
                        shop_list: res.data.data.shop_list
                    })
            })
            //-- 推荐赠品
            this.loadHistory(6, res => {
                console.log('loadHistory:', res.data)
                if (res.data.data.data)
                    this.setData({
                        thistoryList: res.data.data.data
                    })
            })
        })
    },
    loadHistory: function(type, callback) {
        app.post('https://m.58daiyan.com/StoreApi/getCouponExpenseList', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            lastId: 0,
            num: 999,
            type: type,
            startDate: this.data.currGift.startdate,
            endDate: this.data.currGift.date
        }, callback)
    },
    loadScanQrHis: function(tuanselect, callback) {
        app.post('https://m.58daiyan.com/StoreApi/getOrderExpenseList', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            tuanselect: tuanselect,
            lastId: 0,
            num: 999,
            startDate: this.data.currGift.startdate,
            endDate: this.data.currGift.date
        }, callback)
    },
    scanQR: function(e) {
        var sid = this.data.storeId
        console.log('sid:', sid)
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log('scanQR:', res)
                var obj = JSON.parse(res.result)
                console.log(obj)

                if (obj.order_id) {
                    //-- 扫码产品
                    app.post('https://m.58daiyan.com/StoreApi/confirm_order_by_seller', {
                        token: obj.token,
                        order_id: obj.order_id,
                        num: obj.num,
                        seller_token: app.userInfo().token
                    }, res => {
                        app.msgbox({
                            title: "扫码兑现商品",
                            content: res.data.status == 1 ? obj.title + " 兑现成功" : res.data.message,
                            showCancel: false
                        })
                    })
                } else {
                    //-- 扫码赠品
                    if (obj.state == 2) {
                        app.msgbox({
                            title: '警告',
                            content: `「'${obj.title}」于${obj.use_time}已完成消费`,
                            showCancel: false,
                            success: res => {}
                        })
                        return;
                    }
                    if (obj.state == 3) {
                        app.msgbox({
                            title: '警告',
                            content: `「'${obj.title}」已失效`,
                            showCancel: false,
                            success: res => {}
                        })
                        return;
                    }
                    if (obj.store_id != sid) {
                        app.msgbox({
                            title: '警告',
                            content: '「' + obj.title + '」非本商家赠品',
                            showCancel: false,
                            success: res => {

                            }
                        })
                    } else {
                        app.post('https://m.58daiyan.com/StoreApi/scan_code_by_seller', {
                            token: obj.token,
                            coupon_id: obj.coupon_id,
                            num: obj.chose_num,
                            seller_token: app.userInfo().token
                        }, res => {
                            console.log(res.data)
                            app.msgbox({
                                title: '提示',
                                content: '「' + obj.title + '」' + res.data.message,
                                showCancel: false,
                                success: res => {
                                    this.loadChoseData()
                                }
                            })
                        })
                    }
                }
            }
        })
    },
    bindStartDateChange: function(e) {
        var currGift = this.data.currGift;
        currGift.startdate = e.detail.value;
        this.setData({
            currGift: currGift
        })
    },
    bindDateChange: function(e) {
        var currGift = this.data.currGift;
        currGift.date = e.detail.value;
        this.setData({
            currGift: currGift
        })
    },
})