const app = getApp()
Page({
    data: {
        user: null,
        userInfo: null,
        contactList: []
    },
    //-- 显示功隐藏二级会员
    showOrHideSec:function(e){
        var contactList = this.data.contactList
        var showSec = contactList[e.currentTarget.dataset.idx].showSec
        contactList[e.currentTarget.dataset.idx].showSec = !showSec
        this.setData({
            contactList: contactList
        })
    },
    onLoad: function(options) {
        this.setData({
            user: app.globalData.user,
            userInfo: app.globalData.userInfo
        })
    },
    onShow:function(){
        this.getMyContacts()
    },
    getMyContacts:function(){
        app.post('https://m.58daiyan.com/UsersApi/myContacts',{
            token: app.userInfo().token, is_buy: 1, type:3
        },res=>{
            console.log('我的人脉：',res.data)
            if (res.data.data.contactList){
                this.setData({
                    contactList: res.data.data.contactList.map(u=>{
                        u.showSec = false;
                        return u;
                    })
                })
            }
        })
    }
})