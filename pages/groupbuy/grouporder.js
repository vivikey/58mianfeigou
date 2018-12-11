var app = getApp()
Page({
    data: {
        shop_id: 0,
        shopMode: {},
        goods: {},
        store_name: '',
        store_id:0,
        memoToken: 0,
        myBalance:0.0,
        is_token: false,
        is_balance:false,
        lastMoney: {
            freight: "0.00",
            last_price: 0,
            token_use: 0,
            total_price: 0
        },
        tuan_id: 0,
        leavemessage: '',
        order_no: null,
        is_tuijian: false
    },
    leaveMsg: function(e) {
        this.setData({
            leavemessage: e.detail.value
        })
    },
    onTokenChanged: function(e) {
        if (e.detail.value.length > 0) {
            this.setData({
                is_balance: true
            })
        } else {
            this.setData({
                is_balance: false
            })
        }
        this.getTotalPrice()
    },
    onLoad: function(options) {
        console.log(options)
        var shopMode = wx.getStorageSync(options.id)
        if (options.tuijian)
            shopMode.shop_sku[shopMode.chosedIdx].sku_price_tuan = shopMode.shop_sku[shopMode.chosedIdx].sku_price
        console.log(shopMode)
        this.setData({
            shop_id: options.id,
            tuan_id: options.tuan_id || 0,
            shopMode: shopMode,
            store_name: options.store_name,
            store_id:options.store_id,
            is_tuijian: !options.tuijian ? false : true
        })
    },
    onShow: function() {
        // app.getToken(res => {
        //     console.log('getToken:', res.data)
        //     if (res.data.data.token)
        //         this.setData({
        //             memoToken: res.data.data.token
        //         })
        //     this.getTotalPrice()
        // })
        app.getStoreBalance(this.data.store_id,res=>{
            if (res.data.data.money) {
                this.setData({
                    myBalance: res.data.data.money
                })
            }
            this.getTotalPrice()
        })
    },
    addcount: function() {
        var shopMode = this.data.shopMode
        shopMode.count = parseInt(shopMode.count) + 1
        this.setData({
            shopMode: shopMode
        })
        this.getTotalPrice()
    },
    subcount: function() {
        let shopMode = this.data.shopMode
        if (shopMode.count > 1) {
            shopMode.count = parseInt(shopMode.count) - 1
            this.setData({
                shopMode: shopMode
            })
            this.getTotalPrice()
        }
    },
    //-- 计算金额
    getTotalPrice: function() {
        let shopMode = this.data.shopMode
        app.getTotalPrice({
            token: app.userInfo().token,
            shop_id: this.data.shop_id,
            num: shopMode.count,
            tuanselect: this.data.is_tuijian ? 0 : 1,
            sku_id: shopMode.shop_sku[shopMode.chosedIdx].sku_id,
            is_token: this.data.is_token ? 1 : 0,
            is_balance: this.data.is_balance?1:0
        }, res => {
            console.log('getTotalPrice:', res.data)
            let dt=res.data.data
            if (res.data.status == 1) {
                dt.balance_use = dt.balance_use || 0
                dt.token_use = dt.token_use || 0
                this.setData({
                    lastMoney: dt
                })
            }
        })
    },
    //-- 生成订单并且支付
    createOrderAndPay: function() {
        let shopMode = this.data.shopMode
        app.createOrder({
            token: app.userInfo().token,
            rec_token: app.globalData.rec_token || '',
            shop_id: this.data.shop_id,
            num: shopMode.count,
            tuanselect: this.data.is_tuijian ? 0 : 1,
            sku_id: shopMode.shop_sku[shopMode.chosedIdx].sku_id,
            is_token: this.data.is_token ? 1 : 0,
            is_balance: this.data.is_balance ? 1 : 0,
            leavemessage: this.data.leavemessage,
            tuan_id: this.data.tuan_id
        }, res => {
            console.log('createOrder:', res.data)
            if (res.data.data.order_cn) {
                this.setData({
                    order_no: res.data.data.order_cn
                })
                this.wexinpay()
            }
            if (res.data.status == 0) {
                app.msgbox({
                    content: res.data.message,
                    showCancel: false
                })
            }

        })
    },
    //-- 代币微信支付
    wexinpay: function() {
        app.post('https://m.58daiyan.com/MinimallApi/orderQuery/', {
            token: app.userInfo().token,
            order_no: this.data.order_no
        }, res => {
            var tuan_id = res.data.data.order_id
            console.log('orderQuery:', res.data)
            if (res.data.status == 2) {
                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success: d => {
                        let url = `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`
                        if(this.data.is_tuijian){
                            url = `/pages/groupbuy/orderdetail?order_no=${this.data.order_no}`
                        }
                        wx.redirectTo({
                            url: url,
                        })
                    }
                })
            } else {
                wx.login({
                    success: res => {
                        if (res.code) {
                            app.post('https://m.58daiyan.com/MinimallApi/wechatpay', {
                                order_no: this.data.order_no,
                                token: app.userInfo().token,
                                code: res.code
                            }, r => {
                                console.log('recharge:', r.data)
                                if (r.data.status == 1) {
                                    var obj = r.data.data
                                    wx.requestPayment({
                                        'timeStamp': obj.timeStamp,
                                        'nonceStr': obj.nonceStr,
                                        'package': obj.package,
                                        'signType': obj.signType,
                                        'paySign': obj.paySign,
                                        'success': res => {
                                            app.msgbox({
                                                content: '支付成功',
                                                showCancel: false,
                                                success: d => {
                                                    let url = `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`
                                                    if (this.data.is_tuijian) {
                                                        url = `/pages/groupbuy/orderdetail?order_no=${this.data.order_no}`
                                                    }
                                                    wx.redirectTo({
                                                        url: url,
                                                    })
                                                }
                                            })
                                        },
                                        'fail': res => {
                                            var msg = '支付失败:';
                                            if (res.err_desc) {
                                                msg = msg + res.err_desc
                                            }
                                            if (res.errMsg && res.errMsg.indexOf('cancel') > 0) {
                                                msg = msg + '取消支付'
                                            }
                                            app.msgbox({
                                                content: msg,
                                                showCancel: false,
                                                success: d => {
                                                    //-- 跳转到未付款订单页
                                                    wx.navigateTo({
                                                        url: `orderdetail?order_no=${this.data.order_no}`,
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })

    },
})