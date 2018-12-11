var app = getApp()
Page({
    data: {
        activet: 1,
        storeId: 0,
        storeName: '',
        shopList: [],
        schemeList: [],
        giftList: [],
        uid: 0,
        isowner: 0
    },
    onLoad: function(options) {
        this.setData({
            storeId: options.storeId,
            storeName: options.storeName,
            uid: options.uid,
            isowner: app.globalData.user.id == options.uid ? 1 : 0
        })

    },
    onShow: function() {
        this.getDataList()
    },
    //-- 删除方案
    delScheme: function(e) {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }

        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let schemeList = this.data.schemeList
        console.log("id,idx,list:", id, idx, schemeList)
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，请三思！',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '坚决删除',
            success: (r) => {
                if (r.confirm) {
                    let endtime_arr = schemeList[idx].end_time.split(" ");
                    let endtime = `${endtime_arr[0]}T${endtime_arr[1]}.000Z`;
                    let endT = new Date(endtime);
                    let nowT = new Date()
                    if (nowT - endT < 0) {
                        app.msgbox({
                            content: "活动有效期内不能删除！",
                            title: "警告",
                            showCancel: false
                        })
                        return;
                    }

                    app.post('https://m.58daiyan.com/StoreApi/del_recommend_action', {
                        token: app.userInfo().token,
                        action_id: e.currentTarget.dataset.id
                    }, res => {
                        console.log('delScheme:', res.data)
                        app.msgbox({
                            content: res.data.message,
                            showCancel: false,
                            success: d => {
                                this.getDataList()
                            }
                        })
                    })
                }
            }
        })

    },
    //-- 删除产品：
    deleteShop: function(e) {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let shopList = this.data.shopList
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，请三思！',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_shop', {
                        token: app.userInfo().token,
                        shop_id: e.currentTarget.dataset.id
                    }, res => {

                        app.msgbox({
                            content: res.data.message,
                            showCancle: false,
                            success: (r)=> {
                                if (res.data.status == 1)
                                    this.setData({
                                        shopList: shopList.splice(idx, 1)
                                    })
                            }
                        })
                    })
                }
            }
        })
    },
    //--获取数据
    getDataList: function() {
        let t = this.data.activet
        if (t == 1) {
            this.getShopList()
        }
        if (t == 2) {
            this.getSchemeList()
        }
        if (t == 3) {
            this.getGiftList()
        }
    },
    //--切换当前tabMenu
    changemenu: function(e) {
        console.log('changemenu:', e.currentTarget)
        this.setData({
            activet: e.currentTarget.dataset.tp
        })
        this.getDataList()
    },
    //-- 获取产品列表
    getShopList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getShopList', {
            tuanselect: 0,
            store_id: this.data.storeId,
            lastId: 0,
            num: 99
        }, res => {
            console.log('getShopList:', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    shop_list: res.data.data.shop_list.map(u => {
                        u.gallery = !u.gallery ? [] : u.gallery.split(',')
                        u.label = !u.label ? [] : u.label.split(' ')
                        return u;
                    })
                })
            } else {
                this.setData({
                    shop_list: []
                })
            }
        })
    },
    //-- 获取方案列表
    getSchemeList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getRecommendActionListByID/', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            lastId: 0,
            num: 99
        }, res => {
            console.log('getSchemeList:', res.data)
            if (res.data.data.action_list)
                this.setData({
                    schemeList: res.data.data.action_list.map(u => {
                        u.end_time = u.end_time.split(' ')[0]
                        if (u.bd_shopids.length <= 0) {
                            u.bd_shopids = []
                        } else {
                            u.bd_shopids = u.bd_shopids.split(',')
                        }
                        return u;
                    })
                })
            else
                this.setData({
                    schemeList: []
                })
        })
    },
    //-- 获取赠品列表
    getGiftList: function(id) {
        app.post('https://m.58daiyan.com/StoreApi/getPresentListByID', {
            store_id: this.data.storeId,
            is_template: 0,
            type: 2,
            num: 999
        }, res => {
            console.log('获取推荐赠品列表：', res.data)
            if (res.data.data.shop_list)
                this.setData({
                    giftList: res.data.data.shop_list.map(u => {
                        if (u.gallery && u.gallery.length > 0) {
                            u.image = u.gallery.split(',')[0]
                        }
                        return u;
                    })
                })
            else
                this.setData({
                    giftList: []
                })
        })
    },
    //-- 删除推荐赠品
    remove: function(e) {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }
        var id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.idx
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_present', {
                        present_id: id,
                        token: app.userInfo().token,
                        ishidden: 2
                    }, res => {
                        app.msgbox({
                            content: res.data.message,
                            showCancel: false
                        })
                        if (res.data.status == 1) {
                            var giftList = this.data.giftList
                            giftList.splice(index, 1)
                            this.setData({
                                giftList: giftList
                            })
                        }
                    })
                }
            }
        })
    }
})