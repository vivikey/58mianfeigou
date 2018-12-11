var app=getApp()
Page({
  data: {
      user:{},
      member:{},
      daibiList:[]
  },
  onLoad:function(options){
      
  },
  onShow:function () {
          app.getUserFullInfo(res => {
              console.log('getUserFullInfo:', res.data.data.user)
              if (res.data.data.user) {
                  app.globalData.user = res.data.data.user
                  app.globalData.member = res.data.data.member
                  this.setData({
                      user: res.data.data.user,
                      member: res.data.data.member
                  })
              }
          });
  }
})