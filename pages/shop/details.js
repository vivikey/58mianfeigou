var app = getApp()
import FrontEndShop from '../../comm/FrontEndShop.js'
import Address from '../../comm/Address.js'
Page({
    data: {
        version: '',
        goods_id: 0,
        spec_id: 0,
        spec_chosed: 0,
        goods: {},
        classNavList: ['商品', '评价', '详情'],
        classNavActIdx: 0,
        sc: 0,
        addressList: [],
        defaultAddress: { district:'请配置选择收货地址'}
    },
    swiperChange: function(e) {
        this.setData({
            sc: e.detail.current
        })
    },
    onLoad: function(options) {
        if (options.q) {
            var link = decodeURIComponent(options.q);
            console.log(link);
            var params = link.split('?')[1]
            var id = params.split('=')[1]
            options['id'] = id
        }

        this.setData({
            goods_id: options.id || 0,
            spec_id: options.spec || 0,
            version: app.VERSION()
        })
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    //-- 获取用户收货地址
    getUserAddress() {
        Address.List({
            user_id: app.USER_ID()
        }).then(r => {
            console.log('Address.List => ', r)
            if (r.data.length > 0) {
                let defaddr = r.data.find(item => item['default'] == 1)
                defaddr = defaddr || r.data[0]
                this.setData({
                    defaultAddress: defaddr
                })

            }

        })
    },
    //-- 规格选择事件
    bindPickerChange(e){
        this.setData({
            spec_chosed: e.detail.value
        })
    },
    onShow: function() {
        FrontEndShop.Get({
            goods_id: this.data.goods_id,
            user_id: app.USER_ID()
        }).then(r => {
            console.log('FrontEndShop.Get => ', r)
            if (r.code == 200) {
                r.data.goods_banners = r.data.goods_banners.split(',')
                r.data.goods_img = r.data.goods_img.split(',')
                r.data.goods_spec = r.data.goods_spec.map(u=>{
                    u.showT = `${u.spec_size} ${u.spec_color}`
                    return u
                })
                r.data.goods_spec.forEach((val, idx) => {
                    if (val.id == this.data.spec_id) {
                        this.setData({
                            spec_chosed: idx
                        })
                    }
                })
                this.setData({
                    goods: r.data
                })
            }
        })
        let chosedAddress = wx.getStorageSync("chosedAddress") || null
        if (!chosedAddress) {
            this.getUserAddress()
        }else{
            this.setData({
                defaultAddress: chosedAddress
            },wx.removeStorage({
                    key: 'chosedAddress',
                success: function(res) {},
            }))
        }
    },
    //-- 分类导航点击事件
    onClassNavClick(e) {
        this.data.classNavActIdx = e.currentTarget.id
        this.setData({
            classNavActIdx: this.data.classNavActIdx
        })
        this.getShopOrCommList()
    },
})