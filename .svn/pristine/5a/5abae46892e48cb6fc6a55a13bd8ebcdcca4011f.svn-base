var app = getApp()
Page({
    data: {
        user_list: [],
        message_list:[],
        notice_list:[],
        label_list:[],
        storeName: '',
        storeId: 0,
        tabValue: 3,
        sendtype:3,
        user_count:0
   },
    //-- 获取标签列表
    loadLabelList: function (callback) {
        app.getLabelsByStore(this.data.storeId, res => {
            console.log('loadLabelList:', res.data)
            if (res.data.data.label_list)
                this.setData({
                    label_list: res.data.data.label_list
                })
            if (typeof callback === 'function')
                callback()
        })
    },
    onLoad: function(options) {
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId
        })
        
    },
    //-- 加载当前数据
    loadData:function(){
        var type=this.data.sendtype
        if(type==1){
            this.loadMessageList()
        }
        if (type == 2) {
            this.loadNoticeList()
        }
        if (type == 3) {
            this.loadMemberList()
        }
    },
    onShow:function(){
        this.loadLabelList(this.loadData)
    },
    //-- 加载所有关注的会员
    loadMemberList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getUserListByID', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            num: 99
        }, res => {
            console.log('loadMemberList:', res.data)
            if (res.data.data.user_list) {
                var count = res.data.data.user_list.length
                if(count>10000){
                    count=count/10000+'w+'
                }
                this.setData({
                    user_list: res.data.data.user_list,
                    user_count:count
                })
            }
        })
    },
    //-- 获取公告列表
    loadNoticeList:function(){
        app.post('https://m.58daiyan.com/StoreApi/getNoticeListByID',{
            token: app.userInfo().token,
            store_id: this.data.storeId,
            num: 99,
            type:2    
        },res=>{
            console.log('loadNoticeList',res.data)
            if (res.data.data.notice_list) {
                this.setData({
                    notice_list: res.data.data.notice_list
                })
            }
        })
    },
    //-- 获取消息列表
    loadMessageList: function () {
        app.post('https://m.58daiyan.com/StoreApi/getNoticeListByID', {
            token: app.userInfo().token,
            store_id: this.data.storeId,
            num: 99,
            type: 1
        }, res => {
            console.log('loadMessageList', res.data)
            if(res.data.data.notice_list){
                this.setData({
                    message_list: res.data.data.notice_list.map(u=>{
                        u.label_id = this.getLabelName(u.label_id)
                        return u
                    })
                })
            }
        })
    },
    removeMessage:function(e){
        wx.showModal({
            title: '警告',
            content: '删除后将无法恢复，确定吗？',
            confirmColor: '#f00',
            cancelColor: '#50d1fe',
            cancelText: '取消',
            confirmText: '确定',
            success: (res) => {
                if (res.confirm) {
                    app.post('https://m.58daiyan.com/StoreApi/del_notice',{
                        token:app.userInfo().token,
                        notice_id:e.currentTarget.dataset.id
                    },res=>{
                        if(res.data.status==1){
                            this.loadMessageList()
                        }
                    })
                }
            }
        })
    },
    getLabelName:function(arrStr){
        if(!arrStr || arrStr=="0"){
            return [{id:0,name:"所有粉丝"}]
        }else{
            var arr=arrStr.split(',')
            for(var i=0;i<arr.length;i++){
                arr[i] = this.data.label_list.find(u => u.id == arr[i])
            }
            return arr;
        }
    },

    //-- Tab组件切换事件
    onTabChange: function(e) {
        console.log(e)
        this.setData({
            tabValue: e.currentTarget.dataset.value,
            sendtype: e.currentTarget.dataset.value
        })
        if(this.data.sendtype==1){
            this.loadMessageList()
        }
        if (this.data.sendtype == 2) {
            this.loadNoticeList()
        }
        if (this.data.sendtype == 3) {
            this.loadMemberList()
        }
    },
    toLabelMgr:function(){
        var url = 'labelmgr?storeId=' + this.data.storeId + '&storeName=' + this.data.storeName;
        wx.navigateTo({
            url: url,
        })
    },
    toSetLabel:function(e){
        var url = 'setlabel?storeId=' + this.data.storeId + '&storeName=' + this.data.storeName+'&uid=' + e.currentTarget.dataset.uid+'&username='+e.currentTarget.dataset.name;
        wx.navigateTo({
            url: url,
        })
    }

})