var app = getApp()
Page({
    data: {
        poster: {
            content: '',
            posters: []
        },
        gift: {},
        is_tuan: false
    },
    onLoad: function(options) {
        if (options.is_tuan && options.is_tuan == 1) {
            this.setData({
                gift: wx.getStorageSync('currTuanOrder'),
                is_tuan: true
            })
        } else {
            this.setData({
                gift: app.globalData.currGift
            })
        }
        console.log(this.data.gift)
    }, //-- 图片
    choseImg: function() {
        wx.chooseImage({
            count: 6 - this.data.poster.posters.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var poster = this.data.poster;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    app.UploadImg(image, res => {
                        poster.posters.push(app.joinPath(app.globalData.baseUrl, JSON.parse(res.data).data.saveURL));
                        this.setData({
                            poster: poster
                        })

                    })
                }
            }
        })
    },
    //-- 输入框失去焦点事件
    inputBlur: function(e) {
        var poster = this.data.poster;
        poster[e.currentTarget.id] = e.detail.value.trim();
        this.setData({
            poster: poster
        })
    },
    //-- 移除操作
    removeImg: function(e) {
        console.log('image index:', e.target.dataset.idx)
        var poster = this.data.poster
        poster.posters.splice(e.target.dataset.idx, 1)
        this.setData({
            poster: poster
        })
    },
    //-- 执行操作
    Save: function() {
        var poster = this.data.poster;
        if (this.data.is_tuan) {
            app.post('https://m.58daiyan.com/UsersApi/evaluate', {
                token: app.userInfo().token,
                order_id: this.data.gift.order_id,
                goodsEvaluate: JSON.stringify([{
                    goods_id: this.data.gift.shop_list[0].goods_id,
                    content: poster.content,
                    imgs: poster.posters,
                    is_anonymous: 0,
                    scores: 5
                }])
            }, res => {
                if (res.data.status == 1) {
                    this.ShowOKBack()
                }
            })
        } else {
            app.post('https://m.58daiyan.com/MinimallApi/evaluate', {
                token: app.userInfo().token,
                order_id: this.data.gift.create_order_id,
                goodsEvaluate: JSON.stringify([{
                    present_id: this.data.gift.suit_goodIds,
                    content: poster.content,
                    imgs: poster.posters,
                    is_anonymous: 0,
                    scores: 5
                }])
            }, res => {
                if (res.data.status == 1) {
                    this.ShowOKBack()
                }
            })
        }

    },
    ShowOKBack: function() {
        var that = this
        wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#50d1fe',
            content: '评价成功！',
            success: function(data) {
                if (data.confirm) {
                    wx.navigateBack({
                        data: 1
                    })
                }
            }
        })
    }
})