var app=getApp()
Page({
  data: {
      appname: '58免费购小程序',
      version: 'V2.2.1',
      type:1,
      content:''
  },
  onLoad: function (options) {
      this.setData({
          version:app.globalData.version,
          appname: app.globalData.appname
      })
  },
    bindinput:function(e){
        this.setData({
                content: e.detail.value
        })
    },
    bindchange:function(e){
        this.setData({
            type: e.detail.value
        })
    },
    sendMsg:function(){
        app.sendComment({
            token:app.userInfo().token,
            is_anonymous:0,
            content:this.data.content,
            type:this.data.type
        },res=>{
                app.msgbox({
                    content: res.data.message,
                    showCancel: false,
                    success:res=>{}
                })
        })
    }
})