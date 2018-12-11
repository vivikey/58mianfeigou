var app = getApp()
import Address from '../../comm/Address.js'
Page({
    data: {
        version: '',
        user: {},
        address:{
            id: 0,
            user_id: 0,
            user_name: '', //-- 收货人
            province: '',//-- 省
            city: '',//-- 市
            district: '',//-- 区|县
            addr_detail: '',//--详细地址
            phone: ''//-- 电话
        },
        region: ['江苏省', '苏州市', '姑苏区'],
        customItem: '全部'
    },
    onLoad: function (options) {
        let addr_id = options.id || 0
        let user = app.USER()
        this.setData({
            version: app.VERSION(),
            user: user
        })
        if (addr_id)
            Address.Get({ user_id: app.USER_ID(), addr_id}).then(r=>{
                console.log('Address.Get => ',r)
                if (r.code == 200) {
                    this.setData({
                        address: r.data[0]
                    })
                } else {
                    app.ERROR(r.message)
                }
            })
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    inputBlur(e){
        let address = this.data.address
        address[e.currentTarget.id]=e.detail.value
        this.setData({
            address:address
        })
    },
    Save(){
        let address = this.data.address
        let [province, city, district] = [...this.data.region]
        address.province = province
        address.city = city
        address.district = district
        address.user_id = app.USER_ID()

        if (address.user_name.length <= 0) {
            app.msg("请输入收货人姓名")
            return;
        }
        if (address.phone.length <= 0) {
            app.msg("请输入收货人手机号码")
            return;
        }
        if (address.addr_detail.length <= 0) {
            app.msg("请输入详细地址")
            return;
        }

        Address.Post(address).then(r=>{
            console.log('Address.Post => ',r)
            if (r.code === 200) {
                app.SUCCESS(r.message, wx.navigateBack({
                    delta: 1
                }))
            } else {
                app.ERROR(r.message)
            }
        })

    }
})