var app = getApp()
import Shop from '../../comm/Shop.js'
Page({
    data: {
        shopList: [],
        storeName: '',
        storeId: 0,
        version:''
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId,
            version: app.VERSION(),
        })

    },
    onShow() {
        this.getShopList()
    },
    getShopList(){
        Shop.List({user_id:app.USER_ID(),store_id:this.data.storeId}).then(r=>{
            console.log('Shop.List => ',r)
        })
    }
})