var app = getApp()
Page({
    data: {
        giftList: [],
        storeName: '',
        storeId: 0,
        shop_list: [],
        is_template:1
    },
    //-- 设备排序规则
    getSort: function (e) {
        var is_template = e.currentTarget.dataset.val;
        this.setData({
            is_template: is_template,
            shop_list: []
        })
        this.LoadGiftList()
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId
        })
        //this.LoadGiftList()
    },
    onShow:function(){
        this.LoadGiftList()
    },
    LoadGiftList: function(id) {
        app.post('https://m.58daiyan.com/StoreApi/getPresentListByID', {
            store_id: this.data.storeId,
            is_template: this.data.is_template,
            num: 999
        }, res => {
            console.log('获取店铺赠品：', res.data)
            if (res.data.data.shop_list)
                this.setData({
                    shop_list: res.data.data.shop_list
                })
            else
                this.setData({
                    shop_list:[]
                })
        })
    },
    remove:function(e){
        var id=e.currentTarget.dataset.id
        var index=e.currentTarget.dataset.idx
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '我再想想',
            confirmText: '我意已决',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_present',{
                        present_id: id,
                        token: app.userInfo().token,
                        ishidden: 2
                    },res=>{
                        app.msgbox({
                            content:res.data.message,
                            showCancel:false
                        })
                        if(res.data.status==1){
                            var shop_list = this.data.shop_list
                            shop_list.splice(index,1)
                            this.setData({
                                shop_list: shop_list
                            })
                        }
                    })
                }
            }
        })
    }
})