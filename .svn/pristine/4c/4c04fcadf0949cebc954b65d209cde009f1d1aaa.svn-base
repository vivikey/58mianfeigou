var app = getApp()
Page({
    data: {
        shop_id: 0,
        title: '',
        recommend_action: {},
        recommend_list: [],
        total_award_money: 0,
        total_recommend_num: 0,
        status: 0,
        shop: {}
    },
    onLoad: function(options) {
        let id = options.id || 0
        this.setData({
            shop_id: id,
            title: options.title
        })
    },
    //-- 去推荐
    toTuiJian: function(e) {
        wx.navigateTo({
            url: '/pages/tuijian/detail?id=' + e.currentTarget.dataset.sid,
        })
    },
    onShow: function() {
        this.loadData()
    },
    loadData: function(callback) {
        let recommend_list = this.data.recommend_list
        app.post('https://m.58daiyan.com/MinimallApi/myRecommendDetails', {
            token: app.userInfo().token,
            shop_id: this.data.shop_id,
            lastId: 0,
            num: 9999
        }, res => {
            console.log('myRecommendDetails:', res.data)
            if(typeof callback=== 'function'){
                callback()
            }
            let ob = res.data.data
            if (ob.recommend_action) {
                ob.recommend_action.start_time = ob.recommend_action.start_time.split(' ')[0]
                ob.recommend_action.end_time = ob.recommend_action.end_time.split(' ')[0]
                if (ob.recommend_action.bd_shop_gifts)
                    ob.recommend_action.bd_shop_gifts = ob.recommend_action.bd_shop_gifts.filter(u => {
                        return u.shop_id == this.data.shop_id
                    })
                this.setData({
                    recommend_action: ob.recommend_action
                })
            }
            this.setData({
                total_award_money: ob.total_award_money,
                total_recommend_num: ob.total_recommend_num,
                shop: ob.shop,
                status: ob.status
            })
            if (ob.recommend_list) {
                this.setData({
                    recommend_list: ob.recommend_list
                })
            }

        })
    },
    onReachBottom: function() {
        //this.loadData()
    },
    onPullDownRefresh:function(){
        this.loadData(()=>{
            wx.stopPullDownRefresh()
        })
    }
})