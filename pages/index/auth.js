var app = getApp();
Page({
    data: {
    },
    onLoad: function(options) {
    },
    bindGetUserInfo: function(e) {
        console.log("wx.getUserInfo => ",e)
        let data={
            user_img: e.detail.userInfo.avatarUrl,
            gender: e.detail.userInfo.gender,
            nick_name: e.detail.userInfo.nickName,
            country: e.detail.userInfo.country,
            province: e.detail.userInfo.province,
            city: e.detail.userInfo.city,
            user_id: app.USER_ID()
        }
        app._nplogin(data).then(r=>{
            console.log('app._nplogin => ',r)
            if(r.code===200){
                app.USER(r.data)
                wx.navigateBack({
                    delta:1
                })
            }else{
                app.ERROR(`授权登录失败：${r.message}`);
            }
        })
    }
})