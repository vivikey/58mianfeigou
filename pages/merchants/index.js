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
    //-- 删除商铺
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
    },
    //-- 转入信息编辑
    editStore(e){
        wx.navigateTo({
            url: `/pages/merchants/info?id=${e.currentTarget.id}`,
        })
    },
    //-- 转至商铺展示首页
    toStoreHome(e){
        wx.navigateTo({
            url: `/pages/store/detail?id=${e.currentTarget.id}`,
        })   
    }
})