var app = getApp()
Page({
    data: {
        store_id: 0,
        groupbuyList:[]
    },
    onLoad: function(options) {
        this.setData({
            store_id:options.id || 0
        },this.getShopList)
    },
    //--
    getShopList: function() {
        var groupbuyList = this.data.groupbuyList
        var id = this.data.store_id
        app.request('https://m.58daiyan.com/MinimallApi/getShopListByID', 'POST', {
            store_id: id,
            num: 999,
            lastId: 0,
            tuanselect: 0
        }, false, res => {
            console.log('获取店铺推荐产品：', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    groupbuyList: res.data.data.shop_list.map(u => {
                        u.label = !u.label ? [] : u.label.split(' ')
                        return u;
                    })
                })
            }
        })
    },
})