var app=getApp()
Page({
  data: {
      daibiList:[]
  },
  onLoad: function (options) {
      this.dbList()
  },
    dbList: function () {
        app.post('https://m.58daiyan.com/MinimallApi/getTokenlist', {
            token: app.userInfo().token
        }, res => {
            if (res.data.data && res.data.data.length > 0) {
                this.setData({
                    daibiList: res.data.data
                })
            }
        })
    }
})