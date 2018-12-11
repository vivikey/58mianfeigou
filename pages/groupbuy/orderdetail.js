var app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
    data: {
        order_no: 0,
        order_info: {},
        order_goods_info: [],
        xh: false,
        shop_id: 0,
        tuan_id: 0,
        showqrbox: false,
        qr_msg: '',
        qualification: 0,
        text1: '试一试！',
        text2: '你能获得几份',
        text3: '荐三送一',
        text0: 'A',
        goods: {},
        shopMode: {},
    },
    //-- 初始化选择规格
    initChoseGG: function() {
        var goods = this.data.goods
        var shopMode = {
            image: goods.shop_sku[0].sku_img,
            title: goods.title,
            shop_sku: goods.shop_sku,
            chosedIdx: 0,
            count: 1,
            injoin: false,
            show: false
        }
        this.setData({
            shopMode: shopMode
        })
    },
    //-- 获取推荐资格
    getTuijianQualification: function() {
        app.getTuijianQualification(this.data.shop_id, res => {
            console.log('Qualification:', res.data)
            if (res.data.status == 1) {
                this.setData({
                    qualification: res.data.data
                })
            }
        })
    },
    //-- 去商品详情页
    toShopDetail: function() {

        if (this.data.order_info.tuanselect == 1) {
            wx.navigateTo({
                url: '/pages/groupbuy/detail?id=' + this.data.order_goods_info[0].goods_id,
            })
        }
        if (this.data.order_info.tuanselect == 0) {
            wx.navigateTo({
                url: '/pages/tuijian/detail?id=' + this.data.order_goods_info[0].goods_id,
            })
        }
    },
    toAfterPayOK: function() {
        if (this.data.order_info.tuanselect == 1) {
            wx.redirectTo({
                url: `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`,
            })
        }
        if (this.data.order_info.tuanselect == 0) {
            this.loadOrderDetail()
        }
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            order_no: options.order_no
        })
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    onShow: function() {
        this.setData({
            xh: true
        })
        this.loadOrderDetail()
    },
    //-- 获取商品详情
    getGoodsDetail: function() {
        app.post('https://m.58daiyan.com/MinimallApi/getShopDetails', {
            shop_id: this.data.order_goods_info[0].goods_id,
            longitude: app.globalData.userInfo.longitude,
            latitude: app.globalData.userInfo.latitude
        }, res => {
            console.log('getGoodsDetail:', res.data)
            if (res.data.status == 1) {
                var ob = res.data.data;
                ob.content = !ob.content ? [] : ob.content.split(',')
                ob.gallery = !ob.gallery ? [] : ob.gallery.split(',')
                ob.label = !ob.label ? [] : ob.label.split(' ')
                ob.recommend_action.start_time = ob.recommend_action.start_time.split(' ')[0]
                ob.recommend_action.end_time = ob.recommend_action.end_time.split(' ')[0]
                let gifts = []
                if (ob.gifts && ob.gifts.length > 0) {
                    console.log("ob.gifts[]", ob.gifts)
                    for (let item of ob.gifts) {
                        if (gifts.length <= 0) {
                            gifts.push(item)
                        } else {
                            if (gifts.findIndex((v, i) => {
                                    console.log('v:i', v, i);
                                    return v.gift_id == item.gift_id
                                }) < 0) {
                                gifts.push(item)
                            }
                        }

                    }
                    ob.gifts = gifts;
                }
                this.setData({
                    goods: ob
                })
                if (ob.recommend_action.share_content) {
                    let share_texts = ob.recommend_action.share_content.split('|')
                    if (share_texts[0] == "A") {
                        this.setData({
                            text0: share_texts[0],
                            text1: share_texts[1],
                            text2: share_texts[3],
                            text3: share_texts[5]
                        })
                    }
                    if (share_texts[0] == "B") {
                        this.setData({
                            text0: share_texts[0],
                            text1: share_texts[1],
                            text2: share_texts[5],
                            text3: share_texts[3]
                        })
                    }

                }

                this.initChoseGG()
            }
        })
    },
    //-- 增加消费数量
    addcount: function(e) {
        var arr = this.data.order_goods_info
        var idx = e.currentTarget.dataset.idx
        if (arr[idx].use_chosed < arr[idx].can_chosed) {
            arr[idx].use_chosed += 1
            this.setData({
                order_goods_info: arr
            })
        }
    },
    //-- 减少消费数量
    subcount: function(e) {
        var arr = this.data.order_goods_info
        var idx = e.currentTarget.dataset.idx
        if (arr[idx].use_chosed > 1) {
            arr[idx].use_chosed -= 1
            this.setData({
                order_goods_info: arr
            })
        }
    },
    loadOrderDetail: function() {
        app.request('https://m.58daiyan.com/WechatApi/order_info', 'POST', {
                token: app.userInfo().token,
                order_no: this.data.order_no
            }, false,
            res => {
                console.log('loadOrderDetail:', res.data)
                var u = {}
                var arr = []
                if (res.data.data.order_goods_info) {
                    arr = res.data.data.order_goods_info.map(u => {
                        u.goods_use_num = !u.goods_use_num ? 0 : u.goods_use_num
                        u.can_chosed = u.goods_num - u.goods_use_num
                        u.use_chosed = u.can_chosed
                        return u;
                    })
                }
                if (res.data.data.order_info) {
                    u = res.data.data.order_info
                    if (u.order_state == 10) {
                        u.stat = 0;
                        u.statMsg = '待付款'
                    } else if (u.order_state == 20) {
                        if (u.tuanselect == 1 && u.tuan_is_success == 0) {
                            u.stat = 2;
                            u.statMsg = '拼团中'

                        } else {
                            u.stat = 1;
                            u.statMsg = '待消费'
                        }

                    } else if (u.order_state == 40) {
                        u.stat = 3;
                        u.statMsg = '已消费'
                    } else {
                        u.stat = -1;
                        u.statMsg = '已取消'
                    }
                }
                this.setData({
                    order_info: u,
                    order_goods_info: arr,
                    shop_id: arr[0].goods_id,
                    tuan_id: u.order_id
                }, () => {
                    this.getTuijianQualification()
                    this.getGoodsDetail()
                })
                // this.drawQrCode()
            })
    },
    //-- 弹出消费二维码
    showQR: function(e) {
        var idx = e.currentTarget.dataset.idx
        var arr = this.data.order_goods_info
        var item = arr[idx]
        var text = `{"token":"${app.userInfo().token}","num":"${item.use_chosed}","order_id":"${item.order_id}","title":"${item.goods_name}","is_tuan":"${this.data.order_info.tuanselect}","tuan_id":"${this.data.tuan_id}","store_id":"${this.data.order_info.store_id}"}`
        console.log('qrcode:', text)
        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'qrcode',
            foreground: '#50d1fe',
            text: text
        })
        this.setData({
            showqrbox: true,
            qr_msg: `${item.use_chosed}份 ${item.goods_name}`
        })

        this.checkOutQrCodeStat(idx)
    },
    //-- 检查扫码状态
    checkOutQrCodeStat: function(idx) {
        let oldarr = this.data.order_goods_info
        if (this.data.xh) {
            app.request('https://m.58daiyan.com/WechatApi/order_info', 'POST', {
                    token: app.userInfo().token,
                    order_no: this.data.order_no
                }, false,
                res => {
                    var arr = []
                    if (res.data.data.order_goods_info) {
                        arr = res.data.data.order_goods_info.map(u => {
                            u.goods_use_num = !u.goods_use_num ? 0 : u.goods_use_num
                            u.can_chosed = u.goods_num - u.goods_use_num
                            u.use_chosed = u.can_chosed
                            return u;
                        })
                        console.log('已刷新数据:', arr)
                        console.log('消费成功了吗？:', arr.length > 0 && arr[idx].goods_use_num != oldarr[idx].goods_use_num)
                        if (arr.length > 0) {
                            if (res.data.data.order_info.order_state == 40 || arr[idx].goods_use_num != oldarr[idx].goods_use_num) {
                                //-- 表示已经消费了
                                this.loadOrderDetail()
                                app.msg('消费成功！')
                                this.closeQrBox()

                            } else {
                                //-- 还没有消费
                                setTimeout(() => {
                                    this.checkOutQrCodeStat(idx)
                                }, 2000)
                            }
                        } else {
                            app.msgbox({
                                title: 'ERROR',
                                content: '商品数据异常！',
                                showCancel: false,
                            })
                            this.closeQrBox()
                        }
                    }
                })
        }
    },
    //-- 关闭消费二维码
    closeQrBox: function() {
        this.setData({
            showqrbox: false,
            qr_msg: '',
            xh: false
        })
    },
    //-- 取消订单
    cancelOrder: function(e) {
        app.msgbox({
            content: "确定要取消此订单吗？",
            showCancel: true,
            success: d => {
                if (d.confirm)
                    app.cancelOrder(e.currentTarget.dataset.id, res => {
                        if (res.data.status == 1) {
                            app.msg("已取消")
                        } else {
                            app.msgbox({
                                content: res.data.message,
                                showCancel: false
                            })
                        }
                        this.loadOrderDetail()
                    })
            }
        })
    },
    //-- 删除订单
    removeOrder: function(e) {
        app.msgbox({
            content: "删除后无法恢复，确定要删除此订单吗？",
            showCancel: true,
            success: d => {
                if (d.confirm) {
                    app.removeOrder(e.currentTarget.dataset.id, res => {
                        if (res.data.status == 1) {
                            app.msg("已删除")
                            wx.navigateBack({
                                delta: 1
                            })
                        } else {
                            app.msgbox({
                                content: res.data.message,
                                showCancel: false
                            })
                        }
                    })
                }
            }
        })
    },
    //-- 代币微信支付
    wexinpay: function() {
        app.post('https://m.58daiyan.com/MinimallApi/orderQuery/', {
            token: app.userInfo().token,
            order_no: this.data.order_no
        }, res => {
            var tuan_id = res.data.data.order_id
            console.log('orderQuery:', res.data)
            if (res.data.status == 2) {

                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success: d => {
                        wx.redirectTo({
                            url: `/pages/groupbuy/injoin?shop_id=${this.data.shop_id}&tuan_id=${tuan_id}`,
                        })
                    }
                })
            } else {
                wx.login({
                    success: res => {
                        if (res.code) {
                            app.post('https://m.58daiyan.com/MinimallApi/wechatpay', {
                                order_no: this.data.order_no,
                                token: app.userInfo().token,
                                code: res.code
                            }, r => {
                                console.log('recharge:', r.data)
                                if (r.data.status == 1) {
                                    var obj = r.data.data
                                    wx.requestPayment({
                                        'timeStamp': obj.timeStamp,
                                        'nonceStr': obj.nonceStr,
                                        'package': obj.package,
                                        'signType': obj.signType,
                                        'paySign': obj.paySign,
                                        'success': res => {
                                            app.msgbox({
                                                content: "支付成功！",
                                                showCancel: false,
                                                success: d => {
                                                    this.toAfterPayOK()
                                                }
                                            })
                                        },
                                        'fail': res => {
                                            var msg = '支付失败:';
                                            if (res.err_desc) {
                                                msg = msg + res.err_desc
                                            }
                                            if (res.errMsg && res.errMsg.indexOf('cancel') > 0) {
                                                msg = msg + '取消支付'
                                            }
                                            app.msgbox({
                                                content: msg,
                                                showCancel: false,
                                                success: d => {
                                                    //-- 跳转到未付款订单页
                                                    wx.navigateTo({
                                                        url: `orderdetail?order_no=${this.data.order_no}`,
                                                    })
                                                }
                                            })
                                        } //--fail
                                    }) //--wx.requestPayment
                                } //--if
                            }) //--app.post callback
                        } //-- if
                    } //--wx.login success
                }) //--wx.login
            } //--if (res.data.status == 2) else
        })
    },
    //-- 分享到用户或群
    onShareAppMessage: function(res) {
        var resObj = {};
        if (res.from === 'button') {
        let title = `${this.data.text1}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}`
        if (this.data.text0 == 'B')
            title = `${this.data.text1}${this.data.shopMode.title.substr(0, 10)}${this.data.text3}￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price}${this.data.text2}`

        let path = `/pages/tuijian/detail?id=${this.data.shop_id}&rec_token=${app.userInfo().token}&choseIdx=${this.data.shopMode.chosedIdx}`
        if (this.data.qualification != 1)
            path = `/pages/tuijian/detail?id=${this.data.shop_id}&choseIdx=${this.data.shopMode.chosedIdx}`
        console.log('path:',path)
        resObj = {
            title: title,
            path: path,
            imageUrl: this.data.shopMode.image,
            success: res => {
                this.hideShareBox()
                app.request('https://m.58daiyan.com/MinimallApi/recommend', 'POST', {
                    rec_token: app.userInfo().token,
                    shop_id: this.data.shop_id
                }, false, res => {

                })
            }
        }
        console.log('resObj:', resObj)
        }else{
            resObj = {
                title: app.globalData.shareTB,
                path: '/pages/shop/index?rec_token=' + app.userInfo().token,
                imageUrl: app.globalData.shareImg[1],
                success: res => {
                    console.log('share path:', '/pages/shop/index?rec_token=' + app.userInfo().token)
                }
            }
        }
        return resObj
    },
})