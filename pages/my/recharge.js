var app = getApp()
Page({
    data: {
        type: 4, //(1缴年费 ，2，店铺保证金，3，代理费，4是充代币，5充余额必选)
        money: 0,
        member: {},
        jifeng: 0,
        store_id: 0,
        store_name: ''
    },
    onLoad: function(options) {
        this.setData({
            type: options.type,
            money: options.money,
            member: app.globalData.member
        }, () => {
            if (options.type==5) {
                this.setData({
                    store_id: options.store_id,
                    store_name: options.store_name
                })
            }
        })
    },
    endinput: function(e) {
        // if (this.data.type == 5) {
        //     var daibi = e.detail.value
        //     this.setData({
        //         jifeng: daibi * 100
        //     })
        // }
        this.setData({
            money: e.detail.value
        })
    },
    converToJF: function() {
        if (!parseFloat(this.data.money) || parseFloat(this.data.money) < 0.01) {
            app.msgbox({
                content: "金额无效！",
                showCancel: false
            })
        } else {
            app.post('https://m.58daiyan.com/MinimallApi/tokenTointegral', {
                token: app.userInfo().token,
                money: this.data.money
            }, res => {
                console.log(res.data)
                if (res.data.status == 1) {
                    app.msgbox({
                        content: "兑换成功！",
                        showCancel: false,
                        success: d => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                } else {
                    app.msgbox({
                        content: "兑换失败:" + res.data.message,
                        showCancel: false
                    })
                }
            })
        }
    },
    //-- 微信支付
    wexinpay: function() {
        if (!parseFloat(this.data.money) || parseFloat(this.data.money) < 0.01) {
            app.msgbox({
                content: "金额无效！",
                showCancel: false
            })
        } else {
            wx.login({
                success: res => {
                    if (res.code) {
                        if (this.data.type < 6) {
                            app.recharge(this.data.type, this.data.money, res.code,this.data.store_id, r => {
                                console.log('recharge:', r.data)
                                if (r.data.status == 1) {
                                    var obj = r.data.data
                                    wx.requestPayment({
                                        'timeStamp': obj.timeStamp,
                                        'nonceStr': obj.nonceStr,
                                        'package': obj.package,
                                        'signType': obj.signType,
                                        'paySign': obj.paySign,
                                        'success': function(res) {
                                            app.msgbox({
                                                content: "支付成功！",
                                                showCancel: false,
                                                success: d => {
                                                    wx.navigateBack({
                                                        delta: 1
                                                    })
                                                }
                                            })
                                        },
                                        'fail': function(res) {
                                            console.log(res)
                                            if (res.err_desc) {
                                                app.msgbox({
                                                    content: "支付失败:" + res.err_desc,
                                                    showCancel: false
                                                })

                                            }

                                        }
                                    })
                                }
                            })
                        }else{
                            //-- 充值余额
                            app.msgbox({
                                title:'ERROR',
                                content:'数据错误！',
                                showCancel:false
                            })
                        }
                    }
                }
            })

        }
    },
    onShow: function() {

    }
})