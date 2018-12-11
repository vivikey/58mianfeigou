import smallmenuevent from '../../template/smallmenu/smallmenu.js'
var app = getApp()

Page({
    data: {
        smallmenuclosed: true,
        user: null,
        userInfo: null,
        myCoupons: [],
        type:5
    },
    getSort: function (e) {
        console.log(e)
        let type = e.currentTarget.dataset.id
        this.setData({
            type: type,
            myCoupons: []
        })
        this.getMyCoupons()
    },
    onLoad: function(options) {
        this.setData({
            user: app.globalData.user,
            userInfo: app.globalData.userInfo
        })
    },
    toPinJia: function(e) {
        app.globalData.currGift = this.data.myCoupons[e.currentTarget.dataset.idx]
        wx.navigateTo({
            url: 'comment',
        })
    },
    //-- 显示规则
    showGZ: function(e) {
        wx.navigateTo({
            url: '/pages/shop/details?id=' + e.currentTarget.dataset.id,
        })
    },
    //-- 删除赠品券
    removeGift: function(e) {
        app.removeGift(e.currentTarget.dataset.id, res => {
            this.getMyCoupons()
        })
    },
    //-- 获取赠品列表
    getMyCoupons: function() {
        app.post('https://m.58daiyan.com/MinimallApi/myCoupons', {
            token: app.userInfo().token,
            type:this.data.type,
            num: 999
        }, res => {
            console.log("myCoupons:", res.data)
            if (res.data.data.data)
                this.setData({
                    myCoupons: res.data.data.data.map(u => {
                        u.start_time = u.start_time.split(' ')[0]
                        u.end_time = u.end_time.split(' ')[0]
                        u.evaluation_state = !u.evaluation_state ? 0 : u.evaluation_state
                        if (u.state == 1) {
                            let endT = new Date(u.end_time + 'T23:59:59.000Z')
                            let nowT = new Date()
                            let span=nowT-endT
                            if(span>0){
                                u.state=3
                            }
                        }
                        return u;
                    })
                })
        })
    },
    openCloseSmallMenu: function(e) {
        smallmenuevent(this)
    },
    onShow: function() {
        this.getMyCoupons()
    },
    toDetail: function(e) {
        app.globalData.currGift = this.data.myCoupons[e.currentTarget.dataset.idx]
        wx.navigateTo({
            url: 'usegift',
        })
    }
})