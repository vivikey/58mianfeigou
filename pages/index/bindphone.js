var app = getApp();
Page({
    data: {
        canGetcode: true,
        getTitle: '获取验证码',
        phone: '',
        hasSended: false,
        msg: ' ',
        timer: null,
        countrec: 59,
        code: null,
        user:{}
    },
    onLoad: function(options) {
        let user = app.USER()
        var msg='';
        if (!user.user_phone || user.user_phone.length<11){
            msg='您未绑定手机号'
        }else{
            msg = `您已绑定手机号【${user.user_phone}】`
        }
        this.setData({
            user:user,
            msg:msg
        })
    },
    bindingPhone: function() {
        var phone = this.data.phone
        var code = this.data.code
        if (!phone || phone.length < 11) {
            this.setData({
                msg: '请输入11位有效手机号码'
            })
            return;
        }
        if (!code || code.length < 4) {
            this.setData({
                msg: '请输入验证码'
            })
            return;
        }

        app.validatePhoneCode(code, phone, res => {
            if (res.data.status == 0) {
                this.setData({
                    msg: '验证码错误'
                })
                return;
            }
            app.rebindPhone(code, phone, 1,res => {
                if (res.data.status == 0) {
                    this.setData({
                        msg: '验证码错误'
                    })
                    return;
                }
                app.msgbox({
                    content: "绑定成功！",
                    showCancel: false,
                    success: r => {
                        app.globalData.user.phone = phone
                        wx.navigateBack({
                            delta: 1
                        })
                    },
                })
            })
        })
    },
    codeinput: function(e) {
        this.setData({
            code: e.detail.value
        })
    },
    endinput: function(e) {
        console.log(e.detail.value)
        this.setData({
            phone: e.detail.value
        })
    },
    getCode: function() {
        app.canUsedPhone(this.data.phone, res => {
            if (res.data.status == 1) {
                this.setData({
                    msg: '手机号已被绑定！请更换手机号'
                })
                return;
            }
            app.sendPhoneCode(this.data.phone, res => {
                if (res.data.status == 1) {
                    this.setData({
                        msg: '验证码已发送',
                        canGetcode: false,
                        getTitle: '59秒后重发',
                        timer: setInterval(res => {
                            var countrec = this.data.countrec
                            if (countrec > 0) {
                                this.setData({
                                    countrec: countrec - 1,
                                    hasSended: true,
                                    getTitle: `${countrec-1}秒后重发`,
                                })
                            } else {
                                this.setData({
                                    msg: '点击获取验证码重新发送',
                                    canGetcode: true,
                                    countrec: 59,
                                    getTitle: '获取验证码',
                                })
                                clearInterval(this.data.timer)
                            }
                        }, 1000)
                    })
                }
            })
        })
    },
    getPhoneNumber: function(e) {
        app.post('https://m.58daiyan.com/UsersApi/getDefaultPhone', {
            token: app.globalData.userInfo.token,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
        }, res => {
            if (res.data.status == 1) {
                var phone=res.data.data
                app.rebindPhone('', phone, 0, res => {   
                    var msg = res.data.status == 1?"绑定成功":res.data.message               
                    app.msgbox({
                        content: msg,
                        showCancel: false,
                        success: r => {
                            if (res.data.status == 1) {
                                app.globalData.user.phone = phone
                                wx.navigateBack({
                                    delta: 1
                                })
                            }                            
                        },
                    })
                })
            } else {
                console.debug('getDefaultPhone:', res.data)
            }

        });
    }
})