import StoreObj from '../../utils/util.js'
import Store from '../../comm/Store.js'
var app = getApp()
Page({
    data: {
        store: {
            id: 0,
            user_id: 0,
            store_name: '', //-- 商铺名称
            store_addr: '', //-- 商铺地址
            store_logo: '/resource/images/logo.png', //-- 商铺LOGO图片地址
            store_intro: '', //-- 商铺详情
            start_time: '08:00', //-- 营业开始时间
            end_time: '22：00', //-- 营业结束时间
            store_img: [], //-- 商铺图片
            store_type: '', //-- 商铺类型
            store_phone: '', //-- 客服电话
            indentity_card: '', //-- 店主身份证ID
            business_license: [], //-- 商铺营业执照等
            indentity_card_img: [], //-- 店主身份证照,
            on_line: 1 //--1:线上店铺；0：线下店铺
        }
    },
    onLoad(options) {
        let store_id = options.id || 0
        if (store_id)
            Store.Get({user_id:app.USER_ID(),store_id}).then(r=>{
                console.log('Store.Get => ',r)
                if(r.code==200){
                    this.setData({
                        store:r.data.map(u=>{
                            u.business_license = u.business_license.split(',')
                            u.indentity_card_img = u.indentity_card_img.split(',')
                            u.store_img = u.store_img.split(',')
                            return u
                        })[0]
                    })
                }else{
                    app.ERROR(r.message)
                }
            })
    },
    switch1Change(e){
        var store = this.data.store
        store.on_line = e.detail.value ? 1 : 0;
        this.setData({
            store: store
        })
    },
    //-- 时间切换事件：
    bindTimeChange(e) {
        var store = this.data.store
        var id = e.currentTarget.id
        var val = e.detail.value
        store[id] = val
        this.setData({
            store: store
        })
    },
    //-- 更换Logo
    choseImg() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var store = this.data.store;
                var image = tempFilePaths[0]
                app._uploadImage(image).then(r => {
                    var resd = JSON.parse(r.data)
                    if (resd.code == 200) {
                        store.store_logo = app.joinPath(app.globalData.xcxUrl, resd.data);
                        this.setData({
                            store: store
                        })
                    } else {
                        app.msg(resd.message)
                    }
                })
            }
        })
    },
    //-- 图片
    choseIdNumberImg() {
        wx.chooseImage({
            count: 2 - this.data.store.indentity_card_img.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var store = this.data.store;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    app._uploadImage(image).then(r => {
                        var resd = JSON.parse(r.data)
                        if (resd.code == 200) {
                            store.indentity_card_img.push(app.joinPath(app.globalData.xcxUrl, resd.data));
                            this.setData({
                                store: store
                            })
                        } else {
                            app.msg(resd.message)
                        }
                    })
                }
            }
        })
    },
    //-- 选择商铺形象图
    choseStoreImg() {
        wx.chooseImage({
            count: 6 - this.data.store.store_img.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var store = this.data.store;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]

                    app._uploadImage(image).then(r => {
                        var resd = JSON.parse(r.data)
                        if (resd.code == 200) {
                            store.store_img.push(app.joinPath(app.globalData.xcxUrl, resd.data));
                            this.setData({
                                store: store
                            })
                        } else {
                            app.msg(resd.message)
                        }
                    })
                }
            }
        })
    },
    //-- 选择营业执照图片
    choseBusinessImg() {
        wx.chooseImage({
            count: 6 - this.data.store.business_license.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var store = this.data.store;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    app._uploadImage(image).then(r => {
                        var resd = JSON.parse(r.data)
                        if (resd.code == 200) {
                            store.business_license.push(app.joinPath(app.globalData.xcxUrl, resd.data));
                            this.setData({
                                store: store
                            })
                        } else {
                            app.msg(resd.message)
                        }
                    })
                }
            }
        })
    },
    //-- 移除操作
    removeImg(e) {
        var store = this.data.store
        store[e.target.id].splice(e.target.dataset.idx, 1)
        this.setData({
            store: store
        })
    },
    //-- 移除操作
    removeObjImg(e) {
        var store = this.data.store
        store.business_license = null
        this.setData({
            store: store
        })
    },
    //-- 输入框失去焦点事件
    inputBlur(e) {
        var store = this.data.store;
        store[e.currentTarget.id] = e.detail.value;
        this.setData({
            store: store
        })
    },
    //-- 执行操作
    Save() {
        let store = Object.assign({}, this.data.store)
        if (store.store_name.length <= 0) {
            app.msg("请输入商铺名称")
            return;
        }
        if (!store.store_logo || store.store_logo.indexOf("https://") < 0) {
            app.msg("商铺Logo无效")
            return;
        }
        if (!store.indentity_card_img || store.indentity_card_img.length < 2) {
            app.msg("上传身份证正反两面照")
            return;
        }
        if (!store.business_license || store.business_license.length <= 0) {
            app.msg("请上传营业执照图")
            return;
        }
        if (!store.store_img || store.store_img.length <= 0) {
            app.msg("请上传营业执照图")
            return;
        }

        store.indentity_card_img = store.indentity_card_img.join(',')
        store.business_license = store.business_license.join(',')
        store.store_img = store.store_img.join(',')
        store.user_id = app.USER_ID()
        Store.Post(store).then(res=>{
            console.log("Store.Post => ",res)
            if (res.code === 200) {
                app.SUCCESS('提交成功！请等待审核', wx.navigateBack({
                    delta: 1
                }))
            } else {
                app.ERROR(res.message)
            }
        })
    }
})