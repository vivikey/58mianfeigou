var app = getApp()
Page({
    data: {
        store_id: 0,
        customs: [],
        activet: 1
    },
    //--切换当前tabMenu
    changemenu: function (e) {
        console.log('changemenu:', e.currentTarget)
        this.setData({
            activet: e.currentTarget.dataset.tp
        })
        this.getDataList()
    },
    //--获取数据
    getDataList: function () {
        let t = this.data.activet
        if (t == 1) {
            this.loadCustoms
        }
        if (t == 2) {
            this.getSchemeList()
        }
    },
    onLoad: function(options) {
        this.setData({
            store_id: options.id || 0
        }, this.loadCustoms)
    },
    loadCustoms: function() {
        let store_id = this.data.store_id
        app.post('https://m.58daiyan.com/StoreApi/getCustomerListByID',{
            token:app.userInfo().token,
            store_id
        },res=>{
            console.log('getCustomerListByID:',res.data)
                if (res.data.data.customer_list){
                    let data=res.data.data.customer_list.map(u=>{
                        u.sortdata= Date.parse( (u.last_order_time+'.000Z').replace(' ','T') )
                        return u
                    })
                    this.setData({
                        customs: data.sort((a,b)=>{
                            return b.sortdata - a.sortdata
                        })
                    })  
                }
        })
    
    },    //-- 获取方案列表
    getSchemeList: function () {
        let store_id = this.data.store_id
        app.post('https://m.58daiyan.com/StoreApi/getRecommendActionListByID/', {
            token: app.userInfo().token,
            store_id: store_id,
            lastId: 0,
            num: 99
        }, res => {
            console.log('getSchemeList:', res.data)
            if (res.data.data.action_list)
                this.setData({
                    schemeList: res.data.data.action_list.map(u => {
                        if (u.bd_shopids.length <= 0) {
                            u.bd_shopids = []
                        } else {
                            u.bd_shopids = u.bd_shopids.split(',')
                        }
                        return u;
                    })
                })
            else
                this.setData({
                    schemeList: []
                })
        })
    },
})