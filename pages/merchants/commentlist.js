var app = getApp()
Page({
  data: {
    storeName: '',
    storeId: 0,
    message_list: []
  },
  onLoad: function(options) {
    this.setData({
      storeName: options.storeName,
      storeId: options.storeId
    })

  },
  onShow: function() {
    this.setData({
      message_list: []
    })
    this.loadComments()
  },
  //-- 获取访客反馈列表
  loadComments: function() {
    var message_list = this.data.message_list
    app.post('https://m.58daiyan.com/StoreApi/getMessageListByID', {
      token: app.userInfo().token,
      store_id: this.data.storeId,
      num: 20,
      lastId: message_list.length > 0 ? message_list[message_list.length - 1].id : 0
    }, res => {
      console.log('loadComments:', res.data)
      var message_list = this.data.message_list
      if (res.data.data.message_list)
        this.setData({
          message_list: message_list.concat(res.data.data.message_list.map(u => {
            u.replyMsg = ''
            return u;
          }))
        })
    })
  },
  //-- 切换状态
  switchChange: function(e) {
    console.log(e)
    var message_list = this.data.message_list
    var index = e.currentTarget.dataset.idx
    var status = e.currentTarget.dataset.status == 1 ? 2 : 1
    app.setMsgStatus(message_list[index].id, 2, status, res => {
      if (res.data.status == 1) {
        message_list[index].is_show = status
        this.setData({
          message_list: message_list
        })
      } else {
        app.msgbox({
          content: res.data.message,
          showCancel: false
        })

      }
    })
  },
  //-- 回复
  sendReply: function(e) {
    var message_list = this.data.message_list
    var index = e.currentTarget.dataset.idx
    var value = e.detail.value
    message_list[index].replyMsg = value
    this.setData({
      message_list: message_list
    })

  },
  onSendReply: function(e) {
    var message_list = this.data.message_list
    var index = e.currentTarget.dataset.idx
    var value = message_list[index].replyMsg
    if (!value || value.length <= 0) {
      app.msg("回复内容为空！")
      return;
    }
    app.replyMsg(message_list[index].id, value, res => {
      console.log(res)
      wx.showToast({
        title: res.data.message,
        duration: 2000
      })
      if (res.data.status == 1) {
        message_list[index].reply = [];
        message_list[index].reply.push(res.data.data);
        message_list[index].replyMsg = '';
        this.setData({
          message_list: message_list
        })

      }
    })
  },
  //-- 移除回复
  removeReply: function(e) {
    wx.showModal({
      title: '警告',
      content: '确定移除此回复吗？',
      confirmColor: '#f00',
      cancelColor: '#50d1fe',
      cancelText: '取消',
      confirmText: '确定',
      success: (data) => {
        if (data.confirm) {
          var id = e.currentTarget.dataset.id
          var idx = e.currentTarget.dataset.idx
          var index = e.currentTarget.dataset.index
          var message_list = this.data.message_list
          app.removeReply(id, res => {
            if (res.data.status == 1) {
              message_list[index].reply.splice(idx, 1)
              this.setData({
                message_list: message_list
              })
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          })
        }
      }
    })

  },
  onReachBottom: function() {
    this.loadComments()
  }
})