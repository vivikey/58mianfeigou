var app = getApp()
import Address from '../../comm/Address.js'
Page({
    data: {
        version: '',
        user: {},
        addressList: [],
        fromShop: false
    },
    //-- 选择地址返回
    toChosed(e) {
        if (this.data.fromShop) {
            let idx = e.currentTarget.dataset.idx
            wx.setStorageSync("chosedAddress", this.data.addressList[idx])
            wx.navigateBack({
                delta: 1
            })
        }
    },
    onLoad: function(options) {
        let user = app.USER()
        this.setData({
            version: app.VERSION(),
            user: user,
            fromShop: options.fromShop || false
        })
    },
    onShow() {
        this.initData()
    },
    initData() {
        Address.List({
            user_id: app.USER_ID()
        }).then(r => {
            console.log('Address.List => ', r)
            this.setData({
                addressList: r.data
            })
        })
    },
    toEditAddress(e) {
        wx.navigateTo({
            url: `editaddress?id=${e.currentTarget.id}`,
        })
    },
    toDeleteAddress(e) {
        app.CONFIME("地址删除后不能恢复，确定删除该地址吗？", () => {
            Address.Delete({
                user_id: app.USER_ID(),
                addr_id: e.currentTarget.id
            }).then(r => {
                if (r.code === 200) {
                    app.SUCCESS(r.message, this.initData())
                } else {
                    app.ERROR(r.message)
                }
            })
        })
    }
})