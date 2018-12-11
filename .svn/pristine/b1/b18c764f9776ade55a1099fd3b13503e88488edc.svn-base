var app = getApp()
Page({
    data: {
        storeId: 0,
        title: "",
        store: {},
        mgrList: [],
        activet: 1,
        can_use_money: 0,
        moneyList: [],
        hide: 'hide',
        inputinfo: {
            input_money: 0,
            input_name: ''
        },
        lesssec: 0,
        timer: 0,
        sendmsg:'验证码已发送至商铺手机'
    },
    //--切换当前tabMenu
    changemenu: function(e) {
        this.setData({
            activet: e.currentTarget.dataset.tp
        })
        this.getDataList()
    },
    onLoad: function(options) {
        this.setData({
            storeId: options.id,
            title: options.title
        }, () => {
            app.post('https://m.58daiyan.com/StoreApi/getStoreDetails', {
                store_id: this.data.storeId,
                token: app.userInfo().token,
            }, res => {
                this.setData({
                    store: res.data.data
                })
            })
        })
    },
    getDataList: function() {
        if (this.data.activet == 1) {
            this.loadMgrList()
        } else {
            this.getStoreCashList()
        }
    },
    getStoreCashList: function() {
        let url = `${app.globalData.baseUrl}/StoreApi/getStoreCashList`
        let data = {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            //   startTime:'2018-01-01 00:00:00',
            //   endTime:new Date()
        }
        app.post(url, data, res => {
            console.log('getStoreCashList:', res.data)
            if (res.data.status == 1) {
                this.setData({
                    can_use_money: res.data.data.can_use_money,
                    moneyList: res.data.data.CashList
                })
            }
        })
    },
    onShow: function() {
        this.getDataList()
    },
    onUnload:function(){
        clearInterval(this.data.timer)
    },
    sendPhoneCode: function(callback) {
        let phone = this.data.store.rel_phone
        if (this.data.lesssec <= 0) {
            app.sendPhoneCode(phone, res => {
                if (res.data.status == 1) {
                    this.setData({
                        lesssec: 59,
                        timer: setInterval(this.handleInterval, 1000)
                    })
                    
                } else {
                    this.setData({
                        sendmsg:'验证码发送失败',
                        lesssec:0
                    })                    
                }
            })
        }
        if (typeof callback === 'function') {
            callback()
        }
    },
    onTixianClick: function() {
        this.sendPhoneCode(() => {
            this.setData({
                hide: ''
            })
        })
    },
    handleInterval: function() {
        let lesssec = this.data.lesssec
        lesssec -= 1
        if (lesssec <= 0) {
            clearInterval(this.data.timer)
        }
        this.setData({
            lesssec: lesssec
        })

    },
    hideTiXianBox: function() {
        this.setData({
            hide: 'hide'
        })
    },
    inputChange: function(e) {
        let inputinfo = this.data.inputinfo
        inputinfo[e.currentTarget.id] = e.detail.value
        this.setData({
            inputinfo: inputinfo
        })
    },

    comfirTiXian: function() {
        let inputinfo = this.data.inputinfo
        app.validatePhoneCode(inputinfo.input_name, this.data.store.rel_phone, res => {
            if (res.data.status == 1) {
                if (inputinfo.input_money.length<=0) {
                    //-- 提现金额不能小于1！
                    app.msgbox({
                        title: 'Warn',
                        content: '请输入提现金额！',
                        showCancel: false
                    })
                    return;
                }
                if (inputinfo.input_money < 1.0) {
                    //-- 提现金额不能小于1！
                    app.msgbox({
                        title: 'Warn',
                        content: '提现金额不能小于1！',
                        showCancel: false
                    })
                    return;
                }
                if (inputinfo.input_money > 10000.0) {
                    //-- 提现金额不能大于10000！
                    app.msgbox({
                        title: 'Warn',
                        content: '提现金额不能大于10000！',
                        showCancel: false
                    })
                    return;
                }
                if (inputinfo.input_money > this.data.can_use_money) {
                    //-- 可提现金额不足
                    app.msgbox({
                        title: 'Error',
                        content: '可提现金额不足！',
                        showCancel: false
                    })
                    return;
                }

                this.submitTixian(res => {
                    app.msgbox({
                        title: "Result",
                        content: res.data.message,
                        showCancel: false
                    }, this.hideTiXianBox)
                    this.getStoreCashList()
                })
            } else {
                app.msgbox({
                    title: 'ERROR',
                    content: res.data.message,
                    showCancel: false
                })
            }
        })

    },
    //-- 提现提交
    submitTixian: function(callback) {
        wx.login({
            success: res => {
                if (res.code) {
                    let url = `${app.globalData.baseUrl}/UsersApi/paytoStore`
                    let data = {
                        token: app.userInfo().token,
                        store_id: this.data.store_id,
                        money: this.data.inputinfo.input_money,
                        note: this.data.inputinfo.input_name,
                        code: res.code,
                        other: '商铺提现'
                    }
                    app.post(url, data, callback)
                } else {
                    app.msgbox({
                        title: 'Error',
                        content: '系统错误，请稍候重试！',
                        showCancel: false
                    })
                }
            }
        })
    },
    scanQR: function(e) {
        var sid = this.data.storeId
        console.log('sid:', sid)
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var obj = JSON.parse(res.result)
                console.log('scanQR:', obj)
                this.addOneMgr(obj.token, res => {
                    app.msgbox({
                        content: res.data.message,
                        showCancel: false
                    })
                    this.loadMgrList()
                })
            }
        })
    },
    removeOneMgr: function(e) {
        wx.showModal({
            title: '请三思',
            content: '移除后该用户将不能对本商铺进行管理，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_store_permission', {
                        store_id: this.data.storeId,
                        uid: e.currentTarget.dataset.uid,
                        token: app.userInfo().token
                    }, res => {
                        app.msg(res.data.message)
                        this.loadMgrList()
                    })
                }
            }
        })
    },
    //-- 增加一个管理
    addOneMgr: function(token, callback) {
        app.post('https://m.58daiyan.com/StoreApi/add_store_permission', {
            store_id: this.data.storeId,
            token
        }, callback)
    },
    //-- 获取管理员列表
    loadMgrList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getManageList', {
            token: app.userInfo().token,
            store_id: this.data.storeId
        }, res => {
            console.log('loadMgrList:', res.data.message)
            this.setData({
                mgrList: res.data.data
            })
        })
    },
})