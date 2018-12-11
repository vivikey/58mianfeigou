var app = getApp()
Page({
    data: {
        version:'',
        usingComment: false,
        user: {},
        member:{},
        userInfo: {},
        location: '',
        sign: {},
        attention_store_num:0,
        attention_present_num:0,
        message_num:0,
        showhow:false,
        myBalance:0
    },
    //--2.X 转向用户信息编辑
    toEditUserInfo(){
        wx.navigateTo({
            url: 'userinfo',
        })
    },
    showHowGetJF:function(){
        this.setData({
            showhow: false
        })
        wx.navigateTo({
            url: 'about',
        })
    },
    hidehow:function(){
        this.setData({
            showhow: false
        })
    },
    onLoad: function(options) {
        this.setData({
            showhow:true,
            version:app.VERSION()
        })
    },
    //-- 显示地址
    showLocation:function(){
        wx.showModal({
            title: '您的位置',
            content: this.data.location,
        })
    },
    //-- 签到
    sign: function() {
        app.setSign(res=>{
            wx.showModal({
                title: '提示',
                showCancel:false,
                confirmColor:'#50d1fe', 
                content: res.data.message,
                success: res=> {
                    if (res.confirm) {
                        app.refreshIntegralSigninfo(data => {
                            console.log(data.data.data)
                            this.setData({
                                userInfo: app.globalData.userInfo,
                                user: app.globalData.user,
                                sign: data.data.data
                            })
                        })
                    } 
                }
            })
        })
    },
    onShow(){
        let user = app.USER()
        if (!user.user_img) {
            wx.navigateTo({
                url: '/pages/index/auth',
            })
        }else{
            this.setData({
                user:user
            })
        }
    },
    onShow_1X: function() {
        app.getUserLocation((latitude, longitude) => {
            app.updateUserLocation(latitude, longitude);
            app.changeLocation({
                latitude,
                longitude
            }, res => {
                console.log('changeLocation:', res)
                this.setData({
                    userInfo: app.globalData.userInfo,
                    location: res.data.data
                })
            })
        });
        app.refreshIntegralSigninfo(res => {
            console.log('签到信息：', res.data.data)
            this.setData({
                userInfo: app.globalData.userInfo,
                user: app.globalData.user,
                sign: res.data.data
            })
            app.getBalance(res=>{
                console.log('getBalance:',res.data)
                if(res.data.data.money){
                    this.setData({
                        myBalance: res.data.data.money
                    })
                }
            })
        });
        app.getUserInfo(() => {
            app.getUserFullInfo(res => {
                console.log('getUserFullInfo:', res.data.data.user)
                if (res.data.data.user) {
                    app.globalData.user = res.data.data.user
                    app.globalData.member = res.data.data.member
                    this.setData({
                        user:res.data.data.user,
                        member : res.data.data.member,
                        attention_store_num: res.data.data.attention_store_num,
                        attention_present_num: res.data.data.attention_present_num,
                        message_num: res.data.data.message_num
                    })
                    if (this.data.userInfo.integral<100){
                        this.setData({
                            showhow: true
                        })
                    }
                }
            });
        })
    },
    
})