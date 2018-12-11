var app = getApp()
Page({
    data: {
        store_id: 0,
        scheme_id: 0,
        scheme_name: '',
        user_name: '',
        user_id: 0,
        customs: []
    },
    onLoad: function (options) {
        let store_id = options.store_id || 0
        let scheme_id = options.scheme_id || 0
        let scheme_name = options.scheme_name
        this.setData({
            store_id: store_id,
            scheme_id: scheme_id,
            scheme_name: scheme_name,
            user_name: options.user_name,
            user_id: options.user_id
        }, this.loadCustoms)
    },
    loadCustoms: function () {
        let store_id = this.data.store_id
        app.post('https://m.58daiyan.com/StoreApi/getCustomerListByActionID', {
            token: app.userInfo().token,
            action_id:this.data.scheme_id,
            rec_id:this.data.user_id
        }, res => {
            console.log('getCustomerListByID:', res.data)
            if (res.data.data.customer_list) {
                let data = res.data.data.customer_list.map(u => {
                    u.sortdata = Date.parse((u.first_order_time + '.000Z').replace(' ', 'T'))
                    return u
                })
                this.setData({
                    customs: data.sort((a, b) => {
                        return b.sortdata - a.sortdata
                    })
                })  
            }
        })
    },
    onShow: function () {

    }
})