var app = getApp()
Page({
    data: {
        type:0,
        title:'',
        storeList:[],
        shopList:[],
        message_list:[],
        emptymsg:'',
        isempty:true
    },
    onLoad: function(options) {
        if(options.type==1){
            this.setData({
                type:1,
                title:"我关注的商铺",
                emptymsg: '您还没有关注任何商家哦~'
            })
            wx.setNavigationBarTitle({
                title: '我的关注'
            })
            this.getMyAttention()
        }
        if (options.type == 2) {
            this.setData({
                type: 2,
                title: "我收藏的赠品",
                emptymsg: '您还没有收藏任何赠品哦~'
            })
            wx.setNavigationBarTitle({
                title: '我的收藏'
            })
            this.getMyCollect()
        }
        if (options.type == 3) {
            this.setData({
                type: 3,
                title: "我给商家的反馈",
                emptymsg: '您的反馈 如此珍贵'
            })
            wx.setNavigationBarTitle({
                title: '我的反馈'
            })
            this.getMyMessages()
        }
    },
    onShow: function() {
        
    },
    getMyMessages:function(){
        app.loadMessageList({
            token:app.userInfo().token,
            is_store:1,
            type:3,
            num:99
        },res=>{
            console.log('getMyMessages:',res.data)
            if (res.data.data.message_list){
                this.setData({
                    message_list: res.data.data.message_list,
                    isempty: res.data.data.message_list.length<=0
                })
            }
        })
    },
    getMyCollect:function(){
        var data = {
            token: app.userInfo().token,
            num: 99
        }
        app.post('https://m.58daiyan.com/MinimallApi/myCollect',data,res=>{
            console.log('getMyCollect:',res.data)
            if (res.data.data.shopList){
                this.setData({
                    shopList: res.data.data.shopList,
                    isempty: res.data.data.shopList.length <= 0
                })
            }
        })
    }
    ,
    getMyAttention: function() {
        var data={
            token:app.userInfo().token,
            longitude:app.userInfo().longitude,
            latitude:app.userInfo().latitude,
            num:99
        }
        app.post('https://m.58daiyan.com/MinimallApi/myAttention',data,res=>{
            console.log('getMyAttention',res.data)
            if(res.data.data.storeList){
                this.setData({
                    storeList: res.data.data.storeList.filter(u => u.store_name).map(u=>{
                        u.logo = app.joinPath(app.globalData.baseUrl, u.logo);
                        return u;
                    }),
                    isempty: res.data.data.storeList.length <= 0
                })
            }
        })
    }
})