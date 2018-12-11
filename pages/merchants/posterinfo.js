import Poster from '../../utils/Poster.js'
var app = getApp()
Page({
    data: {
        poster: {},
        storeId: 0,
        storeName: '',
        type: 0,
        messageobj: {
            title: '',
            content: '',
            image: null
        },
        titleStr: '',
        contentStr: '',
        label_list: []
    },
    //-- 获取标签列表
    loadLabelList: function() {
        app.getLabelsByStore(this.data.storeId, res => {
            console.log('loadLabelList:', res.data)
            if (res.data.data.label_list)
                this.setData({
                    label_list: res.data.data.label_list
                })
        })
    },
    //-- 图片
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
                        var resd = JSON.parse(res.data)
                        if (resd.status == 1) {
                            if (poster.posters.length < 6) {
                                poster.posters.push(app.joinPath(app.globalData.baseUrl, resd.data.saveURL));
                                this.setData({
                                    poster: poster
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
    //-- 图片
    choseObjImg: function() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var poster = this.data.poster;
                var image = tempFilePaths[0]
                app.UploadImg(image, res => {
                    var resd = JSON.parse(res.data)
                    if (resd.status == 1) {
                        var messageobj = this.data.messageobj
                        messageobj.image = app.joinPath(app.globalData.baseUrl, resd.data.saveURL)
                        this.setData({
                            messageobj: messageobj
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
        var type = this.data.type
        if (type < 1) {
            var poster = this.data.poster;
            poster[e.currentTarget.id] = e.detail.value;
            this.setData({
                poster: poster
            })
        } else {
            var messageobj = this.data.messageobj;
            messageobj[e.currentTarget.id] = e.detail.value;
            this.setData({
                messageobj: messageobj
            })
        }
    },
    //-- 执行操作
    Save: function() {
        var type = this.data.type
        if (type < 1) {
            var poster = this.data.poster;
            if (poster.poster_id > 0) {
                poster.Update(app.post, res => {
                    if (res.data.status === 1) {
                        this.ShowOKBack()
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            confirmColor: '#50d1fe',
                            content: res.data.message
                        })
                    }
                })
            } else {
                poster.Add(app.post, res => {
                    console.log(res)
                    if (res.data.status === 1) {

                        this.ShowOKBack()
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            confirmColor: '#50d1fe',
                            content: res.data.message
                        })
                    }
                })
            }
        } else {
            var messageobj = this.data.messageobj
            var label_list = this.data.label_list
            var label_id = []
            for (var i = 0; i < label_list.length; i++) {
                if (label_list[i].chosed) {
                    label_id.push(label_list[i].id)
                }
            }
            app.post('https://m.58daiyan.com/StoreApi/add_notice', {
                token: app.userInfo().token,
                store_id: this.data.storeId,
                title: messageobj.title,
                image: messageobj.image,
                content: messageobj.content,
                label_id: label_id.length > 0 ? label_id : ['0'],
                city_id: '0',
                type: this.data.type
            }, res => {
                if (res.data.status === 1) {
                    this.ShowOKBack()
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        confirmColor: '#50d1fe',
                        content: res.data.message
                    })
                }
            })
        }
    },
    ShowOKBack: function() {
        wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#50d1fe',
            content: '发布成功！等待审核',
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
            type: options.type
        })
        if (options.type == 0) {
            wx.setNavigationBarTitle({
                title: '活动海报编辑'
            })
            this.setData({
                titleStr: '活动海报标题',
                contentStr: '活动海报内容',
                contentT: '活动海报内容'
            })
            this.initPresent(options.id, options.storeId)
        }
        if (options.type == 2) {
            wx.setNavigationBarTitle({
                title: '公告编辑'
            })
            this.setData({
                titleStr: '公告标题',
                contentStr: '公告内容:纯文字，不多于70个字（包含标点）',
                contentT: '公告内容'
            })
        }
        if (options.type == 1) {
            wx.setNavigationBarTitle({
                title: '消息编辑'
            })
            this.setData({
                titleStr: '消息标题',
                contentStr: '消息内容',
                contentT: '消息内容'
            })
            this.loadLabelList()
        }

    },
    //--onLabelChosed
    onLabelChosed: function(e) {
        var label_list = this.data.label_list
        if (label_list[e.currentTarget.dataset.idx].chosed) {
            label_list[e.currentTarget.dataset.idx].chosed = false
        } else {
            label_list[e.currentTarget.dataset.idx].chosed = true
        }
        this.setData({
            label_list: label_list
        })
    },
    //-- 初始化数据
    initPresent: function(id, storeId) {
        var poster = new Poster(app.globalData.userInfo.token, id, storeId);
        poster.poster_id = id || 0;
        poster.title = '';
        poster.posters = [];
        poster.content = '';
        poster.title = '';
        if (id > 0) {
            poster.Get(app.post, res => {
                console.log('present.Get:', res.data)
                var obj = res.data.data;
                poster.store_id = obj.store_id || 0;
                poster.title = obj.title || '';
                poster.posters = obj.posters.map(u => {
                    u = app.joinPath(app.globalData.baseUrl, u)
                    return u;
                });
                poster.content = obj.content || '';
                this.setData({
                    poster: poster
                })
            })
        } else {
            this.setData({
                poster: poster
            })
        }

    },
    //-- 增加图片
    addImg: function() {

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
    //-- 移除操作
    removeObjImg: function(e) {
        console.log('image index:', e.target.dataset.idx)
        var messageobj = this.data.messageobj
        messageobj.image = null
        this.setData({
            messageobj: messageobj
        })
    }
})