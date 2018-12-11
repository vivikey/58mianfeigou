var app = getApp()
Page({
    data: {
        posterList: [],
        storeName: '',
        storeId: 0
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId
        })
    },
    onShow: function () {
        this.loadPosters()
    },
    loadPosters:function(){
        app.post('https://m.58daiyan.com/StoreApi/getPosterListByID', { token: app.globalData.userInfo.token, store_id: this.data.storeId, num:99},res=>{
            console.log('loadPosters:',res.data)
            if (res.data.data.poster_list){
                this.setData({
                    posterList: res.data.data.poster_list
                })
            }
            else{
                this.setData({
                    posterList: []
                })
            }
        })
    },
    //-- 移除一个活动海报
    deletePoster:function(e){
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '确定删除',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_poster', { token: app.globalData.userInfo.token, poster_id: e.currentTarget.dataset.id},res => {
                        app.msg(res.data.message);
                        if(res.data.status==1){
                            var index=e.currentTarget.dataset.idx
                            var posterList = this.data.posterList
                            posterList.splice(index,1)
                            this.setData({
                                posterList: posterList
                            })
                        }
                    })
                }
            }
        })
    }
})