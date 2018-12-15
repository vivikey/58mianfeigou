var app = getApp()
Page({
    data: {
        version: '',
        networkType: ''
    },
    onLoad(options) {
        console.log('index.options => ',options)
        app.HIGHER_UP(options.higher_up || 0)
        this.setData({
            version: app.VERSION()
        })
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
    onShow() {
        //-- 获取当前网络状态
        wx.getNetworkType({
            success: res => {
                this.setData({
                    networkType: res.networkType.toUpperCase()
                })
            }
        })


    }
})