var app = getApp()
Page({
    data: {
        storeId: 0,
        storeName: '',
        uid: 0,
        inputValue: '',
        label_list: [],
        userlabel_list: [],
        username:''
    },
    toLabelMgr: function() {
        var url = 'labelmgr?storeId=' + this.data.storeId + '&storeName=' + this.data.storeName;
        wx.navigateTo({
            url: url,
        })
    },
    onLoad: function(options) {
        this.setData({
            storeId: options.storeId,
            storeName: options.storeName,
            uid: options.uid,
            username:options.username
        })
    },
    onShow:function(){
        this.getUsersLabels(this.loadLabelList)
    },
    endinput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    getUsersLabels: function(callback) {
        app.post('https://m.58daiyan.com/StoreApi/getUserLabelListByID', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            uid: this.data.uid
        }, res => {
            console.log('getUsersLabels:', res.data)
            if (res.data.data.label_list) {
                this.setData({
                    userlabel_list: res.data.data.label_list
                })
            }
            callback()
        })
    },
    addLabel: function() {
        var val = this.data.inputValue
        app.post('https://m.58daiyan.com/StoreApi/add_label/', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            name: val
        }, res => {
            console.log('addLabel', res.data)
            if (res.data.status == 1) {
                this.loadLabelList()
                this.setData({
                    inputValue: ''
                })
            }
        })
    }, //-- 获取标签列表
    loadLabelList: function() {
        app.getLabelsByStore(this.data.storeId, res => {
            console.log('loadLabelList:', res.data)
            if (res.data.data.label_list)
                this.setData({
                    label_list: res.data.data.label_list.map(u => {
                        var userlabel_list = this.data.userlabel_list
                        u.userlabel = userlabel_list.find(e => e.label_id == u.id)
                        if (u.userlabel)
                            u.chosed = true
                        return u
                    })
                })
        })
    },
    setLabel: function(e) {
        var label_list = this.data.label_list
        if (label_list[e.currentTarget.dataset.idx].chosed) {

            //--移除
            console.log(label_list[e.currentTarget.dataset.idx])
            app.post('https://m.58daiyan.com/StoreApi/del_user_label', {
                token: app.userInfo().token,
                userlabel_id: label_list[e.currentTarget.dataset.idx].userlabel.id
            }, res => {
                if (res.data.status == 1) {
                    label_list[e.currentTarget.dataset.idx].chosed = false;
                    label_list[e.currentTarget.dataset.idx].userlabel = null
                    this.setData({
                        label_list: label_list
                    })
                }
            })

        } else {

            //--增加
            app.post('https://m.58daiyan.com/StoreApi/add_user_label', {
                token: app.userInfo().token,
                store_id: this.data.storeId,
                uid: this.data.uid,
                label_id: label_list[e.currentTarget.dataset.idx].id
            }, res => {

                if (res.data.status == 1) {
                    this.getUsersLabels(this.loadLabelList)
                }
                this.setData({
                    label_list: label_list
                })
            })
        }

    },

})