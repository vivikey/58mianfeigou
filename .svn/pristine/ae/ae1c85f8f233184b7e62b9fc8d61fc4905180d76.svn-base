var app=getApp()
Page({
    data: {
        label_list: [],
        storeName: '',
        storeId: 0,
        inputValue:''
    },
    onLoad: function (options) {
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId
        })
        this.loadLabelList()
    },
    //-- 获取标签列表
    loadLabelList: function () {
        app.getLabelsByStore(this.data.storeId, res => {
            console.log('loadLabelList:', res.data)
            if (res.data.data.label_list)
                this.setData({
                    label_list: res.data.data.label_list
                })
        })
    },
    //-- 完成输入
    endinput:function(e){
        this.setData({
            inputValue: e.detail.value
        })
    },
    endEditinput:function(e){
        var label_list = this.data.label_list
        label_list[e.currentTarget.dataset.idx].nametemp = e.detail.value;
        this.setData({
            label_list: label_list
        })
    },
    //-- 增加一个标签
    addLabel:function(){
        var val=this.data.inputValue
        app.post('https://m.58daiyan.com/StoreApi/add_label/',{
            token: app.userInfo().token,
            store_id: this.data.storeId,
            name:val            
        },res=>{
            console.log('addLabel',res.data)
                if (res.data.status==1){
                    this.loadLabelList()
                    this.setData({
                        inputValue:''
                    })
                }
        })
    },
    //-- 开打编辑
    toEdit:function(e){
        var label_list = this.data.label_list
        label_list[e.currentTarget.dataset.idx].editing = true;
        label_list[e.currentTarget.dataset.idx].nametemp = label_list[e.currentTarget.dataset.idx].name;
        this.setData({
            label_list: label_list
        })
    },
    cancleEdit: function (e) {
        var label_list = this.data.label_list
        label_list[e.currentTarget.dataset.idx].editing = false;
        label_list[e.currentTarget.dataset.idx].nametemp = null;
        this.setData({
            label_list: label_list
        })
    },
    saveEdit: function (e) {
        var label_list = this.data.label_list
        var name = label_list[e.currentTarget.dataset.idx].nametemp;
        var id = label_list[e.currentTarget.dataset.idx].id;
        app.post('https://m.58daiyan.com/StoreApi/add_label/', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            name: name,
            label_id:id
        }, res => {
            console.log('addLabel', res.data)
            if (res.data.status == 1) {
                this.loadLabelList()
                this.setData({
                    inputValue: ''
                })
            }
        })
    },
    removeLabel:function(e){
        var label_list = this.data.label_list
        var id = label_list[e.currentTarget.dataset.idx].id;
        wx.showModal({
            title: '警告',
            content: '确定要删除吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '取消',
            confirmText: '确定',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_label',{
                        token: app.userInfo().token,
                        label_id: id
                    },res=>{
                        if(res.data.status==1){
                            this.loadLabelList()
                        }else{
                            wx.showToast({
                                title: res.data.message,
                                duration:2000
                            })
                        }
                    })
                }
            }
        })
    }
})