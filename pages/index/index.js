var app = getApp()
Page({
    data: {
        version: '',
        msgEN: 'Welcome Back!',
        msgCN: '欢迎回来!',
        showButton: false,
        networkType: ''
    },
    onLoad(option) {
        this.setData({
            version: app.globalData.version
        })
        console.log('index.inLoad...', app.globalData.login)
        if (app.globalData.login)
            this.checkUserAuth(0)
        else
            this.login()
    },
    login(){
        app._init().then(r=>{
            console.log('index.login => ',r)
            r.data["id"]=r.data.user_id
            app.globalData.user = r.data
            wx.switchTab({
                url: '/pages/shop/index',
            })
        })
    },
    //-- 检验是否授权:auth:0-不需要授权
    checkUserAuth(auth) {
        console.log('wx.login -- auth:', auth)
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    //-- 已进行过授权：需要进行用户资料获取
                    if (auth == 1) {
                        this.toAuth()
                    } else {
                        app.getUserInfo(() => {
                            app.getUserFullInfo(res => {
                                    console.log('getUserFullInfo:', res.data.data.user)
                                    if (res.data.data.user) {
                                        app.globalData.user = res.data.data.user
                                        app.globalData.member = res.data.data.member
                                        app.enter()
                                    }
                                },
                                r => {
                                    app.msgbox({
                                        showCancel: false,
                                        title: 'Error',
                                        content: r.errMsg
                                    })
                                })
                        })
                    }
                } else {
                    this.toAuth()
                }
            }
        })
    },
    payAnnualFee() {
        app.Launch(app.globalData.showPage)
    },
    onShow() {
        wx.getNetworkType({
            success: res => {
                this.setData({
                    networkType: res.networkType.toUpperCase()
                })
            }
        })


    }
})