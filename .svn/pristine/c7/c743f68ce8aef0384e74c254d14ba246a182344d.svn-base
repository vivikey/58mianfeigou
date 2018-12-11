var app = getApp()
var pageObj={
    data: {
        Y: '',
        M: '',
        month: '',
        currDate:'2199-01-01',
        income: 0,
        expenditure: 0,
        user: {},
        userInfo: {},
        sign: {},
        log:[],
        icons: [
            '/resource/icon/qiandao2.png',
            '/resource/icon/jifeng-buy.png',
            '/resource/icon/game2.png',
            '/resource/icon/daibi.png',
            '/resource/icon/nearby.png'
            ]   
    },
    onLoad: function(options) {
        var today = new Date();
        this.setData({
            month: today.getFullYear() + '-' + (today.getMonth() + 1),
            Y: today.getFullYear(),
            M: today.getMonth() + 1,
            currDate: today.getFullYear() + '-' + (today.getMonth() + 1)+'-'+today.getDate()
        })
    },
    //-- 获取积分明细 :0-签到得积分 1-购买赠品减积分 2-玩游戏获得积分 3-代币换购积分 4-赠送
    getIntegrallist: function() {
        app.post('https://m.58daiyan.com/MinimallApi/getIntegrallist', {
            token: app.userInfo().token,
            month: this.data.M,
            year: this.data.Y
        }, res => {
            console.log('积分明细：', res.data)
            if (res.data.data.log)
                this.setData({
                    log: res.data.data.log.map(u => {
                        u.num = parseInt(u.num);
                        return u;
                    }),
                    income: res.data.data.Income,
                    expenditure: res.data.data.expend
                })
        })
    },
    //-- 签到
    sign: function() {
        app.setSign(res => {
            wx.showModal({
                title: '提示',
                showCancel: false,
                confirmColor: '#50d1fe',
                content: res.data.message,
                success: res => {
                    this.getIntegrallist()
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
    bindDateChange: function(e) {
        var month = this.data.month;
        month = e.detail.value;
        this.setData({
            month: month,
            Y:month.split('-')[0],
            M: month.split('-')[1],
        })
        this.getIntegrallist()
    },
    onShow: function() {
        app.refreshIntegralSigninfo(res => {
            console.log('签到信息：', res.data)
            this.setData({
                userInfo: app.globalData.userInfo,
                user: app.globalData.user,
                sign: res.data.data
            })
            this.getIntegrallist()
        })
    }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)