var app = getApp()
Page({
    data: {
        recommends:[]
    },
    //--看明细
    toMyTuiJianDetail: function(e) {
        wx.navigateTo({
            url: `mytjdetail?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
        })
    },
    onLoad: function(options) {

    },
    onShow: function() {
        this.loadData()
    },
    loadData:function(){
        let recommends = this.data.recommends
        app.post('https://m.58daiyan.com/MinimallApi/myRecommend', {
            token: app.userInfo().token,
            lastId: recommends.length <= 0 ? 0 : recommends[recommends.length - 1].id,
            num: 20
        }, res => {
            console.log('myRecommend:', res.data)
            if (res.data.data.recommend_list) {

                if (recommends.length <= 0) {
                    recommends = res.data.data.recommend_list
                } else {
                    recommends = recommends.concat(res.data.data.recommend_list)
                }

                this.setData({
                    recommends: recommends.map(u=>{
                        u.start_time = u.start_time.split(' ')[0]
                        u.end_time = u.end_time.split(' ')[0]                        
                        return u;
                    })
                })
            }
        })
    },
    onReachBottom: function () {
        this.loadData()
    }
})