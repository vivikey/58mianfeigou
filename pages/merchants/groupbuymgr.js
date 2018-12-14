var app = getApp()
import Shop from '../../comm/Shop.js'
import TimeConverter from '../../comm/TimeConverter.js'
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
            if(r.code==200){
                this.setData({
                    shopList:r.data.map(u=>{
                        u.goods_banners = u.goods_banners.split(',')
                        u.addtime = TimeConverter.ToLocal(u.addtime);
                        return u;
                    })
                })
            }else{
                app.ERROR(r.message)
            }
        })
    },
    //-- 删除商品
    onDeleteShop(e){
        let shop_id = e.currentTarget.dataset.id
        app.CONFIME("商品删除后不能恢复，确定删除该商品吗？", () => {
            Shop.Delete({ user_id: app.USER_ID(), shop_id }).then(r => {
                if (r.code === 200) {
                    app.SUCCESS(r.message, this.getShopList())
                } else {
                    app.ERROR(r.message)
                }
            })
        })
    }
})