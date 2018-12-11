import StoreObj from '../../utils/util.js'
import Store from '../../comm/Store.js'

var app = getApp()
Page({
    data: {
        version:'',
        user: {},
        userInfo: {},
        storeList: [],
        showadd:true
    },
    onLoad(options) {
        this.setData({
            version:app.VERSION(),
            user: app.globalData.user,
            userInfo: app.globalData.userInfo
        })
    },
    initData(){
        Store.List({ user_id: app.USER_ID() }).then(res => {
            console.log('Store.List =>', res)
            if (res.code === 200) {
                this.setData({
                    storeList: res.data
                })
            } else {
                app.ERROR(`StoreManage.LIST:${res.message}`)
            }
        })
    }, 
    onShow(){
        this.initData()
    },
    onShow_v1X: function() {
        app.post('https://m.58daiyan.com/StoreApi/getStoreList', {
            token: this.data.userInfo.token
        }, res => {
            console.log('getStoreList:', res)
            var showadd=true
            if (res.data.data.store_list)
                this.setData({
                    storeList: res.data.data.store_list.map(u=>{
                        u.logo = app.joinPath(app.globalData.baseUrl, u.logo);
                        if (u.is_check != 1 || u.is_fee=='0'){
                            showadd=false
                        }                      
                        return u;
                    }),
                    showadd: showadd
                })
        })
    },
    delStore(e){
        app.CONFIME("商铺删除后不能恢复，确定删除该商铺吗？", () => {
            Store.Delete({ user_id: app.USER_ID(), store_id: e.currentTarget.id }).then(r => {
                if (r.code === 200) {
                    app.SUCCESS(r.message, this.initData())
                } else {
                    app.ERROR(r.message)
                }
            })
        })
    }
})