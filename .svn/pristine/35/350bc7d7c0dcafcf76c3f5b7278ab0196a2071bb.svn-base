import drawQrcode from '../../utils/weapp.qrcode.esm.js'
var app = getApp()
Page({
    data: {
        gift: {},
        qrover: false,
        xh: false,
        showQr:true,
        currGift:{},
        waitnum:0
    },
    onLoad: function(options) {
        this.setData({
            currGift: app.globalData.currGift
        }, this.getGiftDetail())
        
    },
    openMap: function() {
        var gift = this.data.gift
        console.log('latitude:', gift.store_lat, parseFloat(gift.store_lat))
        console.log('longitude:', gift.store_lng, parseFloat(gift.store_lng))
        wx.openLocation({
            latitude: parseFloat(gift.store_lat),
            longitude: parseFloat(gift.store_lng),
            name: gift.store_name,
            address: gift.store_address
        })
    },
    toPinJia: function() {
        if (this.data.gift.evaluation_state == 0)
            wx.navigateTo({
                url: 'comment',
            })
    },
    //-- 删除赠品券
    removeGift: function(e) {
        app.removeGift(this.data.gift.coupon_id, res => {
            if (res.data.status == 1) {
                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success: res => {
                        wx.navigateBack({
                            data: 1
                        })
                    }
                })
            } else {
                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success: res => {

                    }
                })
            }

        })
    },
    //-- 增加消费数量
    addcount: function (e) {
        let waitnum = this.data.waitnum
        let can_chosed = this.data.gift.can_chosed
        if (waitnum < can_chosed) {
            waitnum += 1
            this.setData({
                waitnum: waitnum
            }, this.drawQrCode)
        }
    },
    //-- 减少消费数量
    subcount: function (e) {
        let waitnum = this.data.waitnum
        if (waitnum > 1) {
            waitnum -= 1
            this.setData({
                waitnum: waitnum
            }, this.drawQrCode)
        }
    },
    onShow: function() {
        this.setData({
            xh: true
        })
        this.getGiftDetail(2000)
    },
    getGiftDetail: function(times) {
        var times = times
        wx.request({
            url: 'https://m.58daiyan.com/MinimallApi/getCouponsDetails',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token: app.userInfo().token,
                coupon_id: this.data.currGift.coupon_id,
                type:this.data.currGift.type
            },
            success: res => {
                
                if (res.data.status == 1) {
                    let d = res.data.data.data
                    console.log(d.start_time)
                    d.start_time = (d.start_time.split(' '))[0]
                    d.end_time = d.end_time.split(' ')[0]
                    d.evaluation_state = !d.evaluation_state ? 0 : d.evaluation_state

                    d.can_chosed = d.num - d.use_num
                    if (d.state == 1) {
                        let endT = new Date(d.end_time + 'T23:59:59.000Z')
                        let nowT = new Date()
                        let span = nowT - endT
                        if (span > 0) {
                            d.state = 3
                        }
                    }
                    if (this.data.waitnum == 0 || this.data.waitnum>d.can_chosed){
                        this.setData({
                            waitnum:d.can_chosed
                        })
                    }
                    this.setData({
                        gift: d
                    })
                    
                    this.drawQrCode()
                    if (times) {
                        if (this.data.gift.state == '1' && this.data.xh) {
                            console.log('准备递归...')
                            setTimeout(() => {
                                this.getGiftDetail(2000)
                            }, times)
                        }
                    }
                }
            },
            complete: function() {
            },
            fail: function(res) {
                console.debug(res)
            }
        });
    },
    onHide: function() {
        this.setData({
            xh: false
        })
    },
    onUnload: function() {
        this.setData({
            xh: false
        })
    },
    drawQrCode: function() {
        var text = `{"token":"${app.userInfo().token}","state":"${this.data.gift.state}","coupon_id":"${this.data.gift.coupon_id}","store_id":"${this.data.gift.store_id}","title":"${this.data.gift.title}","user_time":"${this.data.gift.use_time}","chose_num":"${this.data.waitnum}"}`
        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'qrcode',
            foreground: this.data.gift.state == 2 ? '#ccc' : '#50d1fe',
            text: text
        })
        var ctx = wx.createCanvasContext('qrcode2', this)
        ctx.drawImage('/resource/icon/yxf.png', 0, 0, 100, 100)
        ctx.draw()
    }
})