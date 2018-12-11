var app = getApp()
import Goods from '../../utils/groupbuy.js'
Page({
    data: {
        notuan: 0,
        isowner: false,
        specsItem: {
            sku_spec: '',
            sku_img: '',
            sku_stock: 0,
            sku_price: 0.0,
            sku_price_tuan: 0.0,
            sku_style: '',
            sku_series: ''
        },
        goods: {},
        validTimeIdx: 0,
        validTime: [{
                k: 24,
                v: '24小时'
            },
            {
                k: 48,
                v: '48小时'
            },
            {
                k: 72,
                v: '72小时'
            },
            {
                k: 0,
                v: '一直有效'
            },
        ]
    },
    bindValidTimeChange: function(e) {
        console.log('更改开团后有效时间：', e.detail.value)
        var validTime = this.data.validTime;
        var validTimeIdx = e.detail.value;
        var goods = this.data.goods;
        goods.tuan_time = validTime[validTimeIdx].k
        this.setData({
            validTimeIdx: validTimeIdx,
            goods: goods
        })
    },
    onLoad: function(options) {
        console.log('options:', options)
        var notuan = options.notuan || 0
        this.setData({
            notuan: notuan,
            isowner: options.isowner || true
        })
        var shop_id = options.gid || 0
        var store_id = options.storeId
        var goods = new Goods(app.userInfo().token, shop_id, store_id)

        goods.tuanselect = (!notuan || notuan == 0)?1:0
        goods.start_time = app.getInitTime(0)
        goods.end_time = app.getInitTime(1)
        goods.tuanz_starttime = app.getInitTime(0)
        goods.tuanz_endtime = app.getInitTime(1)

        if (shop_id < 0 || !shop_id) {
            this.setData({
                store_id: store_id,
                shop_id: shop_id,
                goods: goods,
            })
        }
        if (shop_id > 0) {
            goods.Get(app.post, res => {
                var ob = res.data.data;
                console.log(ob)
                goods.shop_id = ob.id;
                goods.store_id = ob.store_id;
                goods.title = ob.title;
                goods.price = ob.price;
                goods.integral = ob.integral;
                goods.label = ob.label;
                goods.type = 0;
                goods.type_id = ob.type_id;
                goods.image = ob.image;
                goods.specs = ob.specs;
                goods.description = ob.description;
                goods.details = !ob.content ? [] : ob.content.split(',');
                goods.max_times = 0;
                goods.gallery = !ob.gallery ? [] : ob.gallery.split(',');
                goods.tuan_buynum = ob.tuan_buynum;
                goods.tuan_time = ob.tuan_time;
                goods.tuan_price = ob.tuan_price;
                goods.tuan_num = ob.tuan_num;
                goods.tuanselect = ob.tuanselect;
                goods.tuanz_starttime = ob.tuanz_starttime;
                goods.tuanz_endtime = ob.tuanz_endtime;
                goods.start_time = ob.start;
                goods.end_time = ob.end;
                goods.num = ob.num;
                goods.shop_sku = !ob.shop_sku ? [] : ob.shop_sku


                var validTimeIdx = this.data.validTimeIdx
                var validTime = this.data.validTime
                for (var i = 0; i < validTime.length; i++) {
                    if (goods.tuan_time == validTime[i].k) {
                        validTimeIdx = i
                    }
                }
                this.setData({
                    store_id: store_id,
                    shop_id: shop_id,
                    goods: goods,
                    validTimeIdx: validTimeIdx
                })
            })
        }

    },
    onShow: function() {},
    inputBlur: function(e) {
        var goods = this.data.goods;
        goods[e.currentTarget.id] = e.detail.value;
        this.setData({
            goods: goods
        })
    },
    specsItemInput: function(e) {
        var specsItem = this.data.specsItem
        specsItem[e.currentTarget.id] = e.detail.value;
        this.setData({
            specsItem: specsItem
        })
    },
    //-- 选择规格图片
    choseSpecsItemImg: function() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var specsItem = this.data.specsItem;
                var image = tempFilePaths[0]
                console.log('规格图片：', res.tempFilePaths)
                wx.showLoading({
                    title: '图片上传中...',
                })
                app.UploadImg(image, res => {
                    wx.hideLoading()
                    var resd = JSON.parse(res.data)
                    if (resd.status == 1) {
                        specsItem.sku_img = app.joinPath(app.globalData.baseUrl, resd.data.saveURL);
                        this.setData({
                            specsItem: specsItem
                        })
                    } else {
                        app.msg(resd.message)
                    }

                })
            }
        })
    },
    //-- 移除规格图片
    removeSpecsItemImg: function() {
        var specsItem = this.data.specsItem
        specsItem.sku_img = null;
        this.setData({
            specsItem: specsItem
        })
    },
    //-- 移除一个规格
    removeSpecsItem: function(e) {
        var goods = this.data.goods
        var idx = e.currentTarget.dataset.idx
        if (goods.shop_sku.length - idx > 0) {
            goods.shop_sku.splice(idx, 1);
        }
        this.setData({
            goods: goods
        })
    },
    //-- 增加一个规格
    addSpecsItem: function() {
        var specsItem = this.data.specsItem
        if (specsItem.sku_spec.length <= 0) {
            app.msg("请输入规格描述")
            return;
        }
        if (specsItem.sku_stock.length <= 0) {
            app.msg("请输入规格库存")
            return;
        }
        if (parseInt(specsItem.sku_stock) < 0) {
            app.msg("请输入有效规格库存")
            return;
        }
        if (specsItem.sku_price.length <= 0) {
            app.msg("请输入原价")
            return;
        }
        if (parseFloat(specsItem.sku_price) < 0.0) {
            app.msg("请输入有效原价")
            return;
        }
        if (specsItem.sku_price_tuan.length <= 0) {
            app.msg("请输入团购价格")
            return;
        }
        if (parseFloat(specsItem.sku_price_tuan) < 0.0) {
            app.msg("请输入有效团购价格")
            return;
        }
        if (!specsItem.sku_img || specsItem.sku_img.indexOf("https://") < 0) {
            app.msg("请上传规格缩略图")
            return;
        }

        var goods = this.data.goods
        goods.shop_sku.push(specsItem)
        this.setData({
            goods: goods
        })
        specsItem.sku_img = null;
        specsItem.sku_spec = '';
        specsItem.sku_stock = 0;
        specsItem.sku_price = 0.0;
        specsItem.sku_price_tuan = 0.0
        this.setData({
            specsItem: specsItem
        })

    },
    bindStartDateChange: function(e) {
        var goods = this.data.goods;
        goods.tuanz_starttime = e.detail.value;
        this.setData({
            goods: goods
        })
    },
    bindDateChange: function(e) {
        var goods = this.data.goods;
        goods.tuanz_endtime = e.detail.value;
        this.setData({
            goods: goods
        })
    },
    bindStartDateChangeNoTuan: function(e) {
        var goods = this.data.goods;
        goods.start_time = e.detail.value;
        this.setData({
            goods: goods
        })
    },
    bindDateChangeNoTuan: function(e) {
        var goods = this.data.goods;
        goods.end_time = e.detail.value;
        this.setData({
            goods: goods
        })
    },
    //-- 选择轮番图图片
    choseGalleryImg: function() {
        wx.chooseImage({
            count: 5 - this.data.goods.gallery.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {

                var tempFilePaths = res.tempFilePaths
                var goods = this.data.goods;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    wx.showLoading({
                        title: '图片上传中...',
                    })
                    app.UploadImg(image, res => {
                        wx.hideLoading()
                        var resd = JSON.parse(res.data)
                        if (resd.status == 1) {
                            if (goods.gallery.length < 6) {
                                goods.gallery.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                                this.setData({
                                    goods: goods
                                })
                            }
                        } else {
                            app.msg(resd.message)
                        }
                    })
                }
            }
        })
    },
    //-- 移除轮播图图片
    removeGalleryImg: function(e) {
        var goods = this.data.goods
        goods.gallery.splice(e.target.dataset.idx, 1)
        this.setData({
            goods: goods
        })
    },
    //-- 选择详情图片
    choseDetailsImg: function() {
        wx.chooseImage({
            count: 6 - this.data.goods.details.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var goods = this.data.goods;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    wx.showLoading({
                        title: '图片上传中...',
                    })
                    app.UploadImg(image, res => {
                        wx.hideLoading()
                        var resd = JSON.parse(res.data)
                        if (resd.status == 1) {
                            if (goods.details.length < 6) {
                                goods.details.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                                this.setData({
                                    goods: goods
                                })
                            }
                        } else {
                            app.msg(resd.message)
                        }
                    })
                }
            }
        })
    },
    //-- 移除详情图片
    removeDetailsImg: function(e) {
        var goods = this.data.goods
        goods.details.splice(e.target.dataset.idx, 1)
        this.setData({
            goods: goods
        })
    },
    //-- 增加或修改
    Save: function() {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }
        var goods = this.data.goods;
        if (goods.title.length <= 0) {
            app.msg("请输入商品名称")
            return;
        }
        if (goods.tuan_num < 2) {
            app.msg("请输入有效的成团人数")
            return;
        }
        if (!goods.shop_sku || goods.shop_sku.length <= 0) {
            app.msg('请增加规格')
            return;
        }

        goods.Set(app.post, res => {
            console.log(res)
            if (res.data.status === 1) {
                var data = this.data.goods
                if (typeof data.shop_sku === 'string')
                    data.shop_sku = JSON.parse(data.shop_sku)
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: res.data.message,
                    success: function(data) {
                        if (data.confirm) {
                            wx.navigateBack({
                                data: 1
                            })
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: res.data.message
                })
            }
        })

    },
    //-- 移除商品
    Remove: function() {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，请三思！',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    this.data.goods.Delete(app.post, res => {
                        app.msgbox({
                            content: res.data.message,
                            showCancle: false,
                            success: function(res) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        })
                    })
                }
            }
        })
    }
})