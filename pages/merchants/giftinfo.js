import StoreObj from '../../utils/util.js'
var app = getApp()
Page({
    data: {
        present: {},
        gifttype: [],
        currGift: {
            gifttype: 0,
            date: '2018-08-01',
            startdate: '2018-08-01'
        },
        is_template:1
    },
    bindStartDateChange: function(e) {
        var currGift = this.data.currGift;
        currGift.startdate = e.detail.value;
        var present = this.data.present;
        present.start_time = e.detail.value
        this.setData({
            currGift: currGift,
            present: present
        })
    },
    bindDateChange: function(e) {
        var currGift = this.data.currGift;
        currGift.date = e.detail.value;
        var present = this.data.present;
        present.end_time = e.detail.value
        this.setData({
            currGift: currGift,
            present: present
        })
    },
    bindTypeChange: function(e) {
        console.log('选择类型：', e.detail.value)
        var currGift = this.data.currGift;
        currGift.gifttype = e.detail.value;
        var present = this.data.present;
        present.type_id = this.data.gifttype[e.detail.value].id
        this.setData({
            currGift: currGift,
            present: present
        })
    },
    //-- 更换图片
    choseImg: function() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var present = this.data.present;
                var image = tempFilePaths[0]
                wx.showLoading({
                    title: '图片上传中...',
                })
                app.UploadImg(image, res => {
                    wx.hideLoading()
                    var resd = JSON.parse(res.data)
                    if (resd.status == 1) {
                        present.image = app.joinPath(app.globalData.baseUrl, resd.data.saveURL);
                        this.setData({
                            present: present
                        })
                    } else {
                        app.msg(resd.message)
                    }

                })
            }
        })
    },
    //-- 输入框失去焦点事件
    inputBlur: function(e) {
        var present = this.data.present;
        present[e.currentTarget.id] = e.detail.value;
        this.setData({
            present: present
        })
    },
    //-- 执行操作
    Save: function(e) {
        var check = e.currentTarget.dataset.check
        var present = this.data.present;
        present.is_check = check;
        if (present.title.length <= 0) {
            app.msg("请输入赠品名称")
            return;
        }
        if (present.price <= 0) {
            app.msg("请输入有效的赠品价格")
            return;
        }
        if (!present.image || present.image.indexOf("https://") < 0) {
            app.msg("赠品图片无效")
            return;
        }
        if (!present.integral || present.integral < 100) {
            app.msg("请输入不小于100的赠品积分")
            return;
        }
        present.Set(app.post, res => {
            console.log(res)
            if (res.data.status === 1) {
                this.ShowOKBack(check)
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
    ShowOKBack: function (check) {
        var that = this
        wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#50d1fe',
            content: check == 0 ?"保存成功":'保存成功！请等待审核',
            success: function(data) {
                if (data.confirm) {
                    wx.navigateBack({
                        data: 1
                    })
                }
            }
        })
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            storeId: options.storeId,
            storeName: options.storeName,
            is_template: options.is_template || 1
        })
        app.post('https://m.58daiyan.com/StoreApi/getPresentType/', {}, res => {
            console.log('赠品类型：', res.data)
            if (res.data.status === 1) {
                this.setData({
                    gifttype: res.data.data
                })
            }
            this.initPresent(options.id, options.storeId)
        })

    },
    //-- 初始化赠品数据
    initPresent: function(id, storeId) {
        var present = new StoreObj.Present(app.globalData.userInfo.token, id, storeId);

        present.image = app.joinPath(app.globalData.baseUrl, '/Uploads/2018-08-07/5b692ff2b215c.png');
        present.type = 1;
        if (id > 0) {
            present.Get(app.post, this.data.is_template, res => {
                console.log('present.Get:', res.data)
                var obj = res.data.data;
                present.title = obj.title || '';
                present.price = obj.price || '';
                present.integral = obj.integral || 100;
                present.type = obj.type || '';
                present.image = app.joinPath(app.globalData.baseUrl, obj.image || '/Uploads/2018-08-07/5b692ff2b215c.png');
                present.specs = obj.specs || '';
                present.description = obj.description || '';
                present.max_times = obj.xg_count || 1;
                present.end_time = obj.end || '';
                present.start_time = obj.start || '';
                present.num = obj.num || 0;
                present.type_id = obj.type_id || 153;
                present.videos = !obj.videos ? [] : obj.videos.split(',');
                // 新增属性
                present.content = obj.content || ''; //（赠品详情）
                present.gallery = !obj.gallery ? [] : obj.gallery.split(','); // 赠品轮番图
                present.is_deposit = obj.is_deposit || false; //(是否缴纳保证金),
                present.cash_deposit = obj.cash_deposit || 0; //（保证金额）
                present.return_deposit_num = obj.return_deposit_num || 3; //（推荐满多少人返回保证金）
                present.is_delivery = obj.is_delivery || 0; //（1是发货 0为不发货）
                present.freight = obj.freight || 0; //（运费）
                present.use_rule = obj.use_rule || ''; //（使用规则）
                present.content_imgs = !obj.content_imgs ? [] : obj.content_imgs.split(','); //（赠品详情图）                

                present.valid_time_type = obj.valid_time_type || 1;
                present.valid_time_days = obj.valid_time_days || 0;

                var currGift = this.data.currGift
                currGift.date = obj.end
                currGift.startdate = obj.start
                for (var i = 0; i < this.data.gifttype.length; i++) {
                    if (obj.type_id == this.data.gifttype[i].id) {
                        currGift.gifttype = i
                    }
                }
                this.setData({
                    present: present,
                    currGift: currGift
                })
            })
        } else {
            let today = new Date()
            var currGift = this.data.currGift
            currGift.date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
            currGift.startdate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
            present.end_time = currGift.date;
            present.start_time = currGift.startdate;
            this.setData({
                present: present,
                currGift: currGift
            })
        }

    },
    //-- 移除操作
    Remove: function() {
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    this.data.present.Delete(app.post, res => {
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
    },
    onRadioChanged: function (e) {
        var present = this.data.present
        present.valid_time_type = e.detail.value
        this.setData({
            present: present
        })
    },
    //-- 选择轮番图图片
    choseGalleryImg: function() {
        wx.chooseImage({
            count: 5 - this.data.present.gallery.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var present = this.data.present;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    wx.showLoading({
                        title: '图片上传中...',
                    })
                    app.UploadImg(image, res => {
                        wx.hideLoading()
                        var resd = JSON.parse(res.data)
                        if (resd.status == 1) {
                            if (present.gallery.length < 6) {
                                present.gallery.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                                this.setData({
                                    present: present
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
        var present = this.data.present
        present.gallery.splice(e.target.dataset.idx, 1)
        this.setData({
            present: present
        })
    },
    //-- 选择详情图片
    choseDetailsImg: function() {
        wx.chooseImage({
            count: 6 - this.data.present.content_imgs.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var present = this.data.present;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    wx.showLoading({
                        title: '图片上传中...',
                    })
                    app.UploadImg(image, res => {
                        wx.hideLoading()
                        var resd = JSON.parse(res.data)
                        if (resd.status == 1) {
                            if (present.content_imgs.length < 6) {
                                present.content_imgs.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                                this.setData({
                                    present: present
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
        var present = this.data.present
        present.content_imgs.splice(e.target.dataset.idx, 1)
        this.setData({
            present: present
        })
    },
    //-- 选择视频
    chosevideo: function() {
        wx.chooseVideo({
            maxDuration: 30,
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePath = res.tempFilePath
                var duration = res.duration
                var size = res.size
                var height = res.height
                var width = res.width
                var present = this.data.present;
                console.log('chooseVideo:', res)
                app.UploadImg(tempFilePath, res => {
                    var resd = JSON.parse(res.data)
                    if (resd.status == 1) {
                        if (present.videos.length < 1) {
                            present.videos.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                            this.setData({
                                present: present
                            })
                        }
                    } else {
                        app.msg(resd.message)
                    }
                })

            }
        })
    },
    //-- 移除视频
    removevideo: function(e) {
        var present = this.data.present
        present.videos.splice(e.target.dataset.idx, 1)
        this.setData({
            present: present
        })
    },
})