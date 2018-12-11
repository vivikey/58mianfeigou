var app=getApp()
Page({
  data: {
      messageList:[],
      pNotice:{},
      sNotice:{}
  },
  onLoad: function (options) {
    this.getMessageList()
  },
  onShow: function () {
      var today = new Date()
      this.setData({
          now: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes()+':'+today.getSeconds()
      })
      this.getNoticeN()
  },
  getNoticeN:function(){
      app.getUnReadNum({
          is_store: 2,
          type: 2
      },res=>{
          console.log('平台公告:',res.data)
          if(res.data.data.first_notice){
              res.data.data.first_notice.addtime = app.convertDate(res.data.data.first_notice.addtime)
              this.setData({
                  pNotice: res.data.data
              })
          }else{
              this.setData({
                  pNotice: null
              })
          }
          app.getUnReadNum({
              is_store: 1,
              type: 2
          },r=>{
              console.log('商家公告:', res.data)
              if (r.data.data.first_notice) {
                  r.data.data.first_notice.addtime = app.convertDate(r.data.data.first_notice.addtime)
                  this.setData({
                      sNotice: r.data.data
                  })
              } else{
                  this.setData({
                      sNotice: null
                  })
              }
          })
      })
  },
  getMessageList:function(){
      app.getMsgNoticeList(1,1,res=>{
          console.log('getMessageList',res.data)
          if(res.data.status==1){
              this.setData({
                  messageList:res.data.data.map(u=>{
                      u.addtime = app.convertDate(u.addtime)
                      return u;
                  })
              })
          }
      })
  }
})