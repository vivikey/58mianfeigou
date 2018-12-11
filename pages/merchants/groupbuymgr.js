var app = getApp()
Page({
    data: {
        groupbuyList: [],
        storeName: '',
        storeId: 0,
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId
        })

    },
    onShow: function() {
        this.LoadList()
    },
    //-- 加载列表
    LoadList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getTuanList', {
            store_id: this.data.storeId,
            lastId: 0,
            num: 99
        }, res => {
            console.log('getTuanList:', res.data)
            if (res.data.data.shop_list)
                this.setData({
                    groupbuyList: res.data.data.shop_list.map(u => {
                        u.gallery = !u.gallery ? [] : u.gallery.split(',')
                        u.label = !u.label ? [] : u.label.split(' ')
                        return u;
                    })
                })
        })
    },
    deleteGroupBuy: function(e) {
        var id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.idx
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，请三思！',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_shop', {
                        shop_id: id,
                        token: app.userInfo().token
                    }, res => {
                        app.msg(res.data.message)
                        if (res.data.status == 1) {
                            var groupbuyList = this.data.groupbuyList
                            groupbuyList.splice(index, 1)
                            this.setData({
                                groupbuyList: groupbuyList
                            })
                        }
                    })
                }
            }
        })
    }
})