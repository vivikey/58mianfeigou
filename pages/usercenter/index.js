var app = getApp()
Page({
    data: {
        version:'',
        user: {},
    },
    onLoad: function(options) {
        this.setData({
            version: app.VERSION()
        })
        
    },
    onShow(){
        let user = app.USER()
        if (!user.user_img) {
            wx.navigateTo({
                url: '/pages/index/auth',
            })
        } else {
            this.setData({
                user: user
            })
        }
    },
    //--2.X 转向用户信息编辑
    toEditUserInfo() {
        wx.navigateTo({
            url: 'userinfo',
        })
    },
})