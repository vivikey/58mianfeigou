var app=getApp()
Page({
  data: {
      balanceList:[],
      myBalance:0.00
  },
  onLoad: function (options) {     

  },
  onShow: function () {
      app.getBalance(res => {
          console.log('getBalance:', res.data)
          if (res.data.data.money) {
              this.setData({
                  myBalance: res.data.data.money
              })
          }
          app.post('https://m.58daiyan.com/MinimallApi/getMoneyList', { token: app.userInfo().token }, res => {
              console.log('getMoneyList:', res.data)
              if (res.data.status == 1) {
                  let data = res.data.data
                  if (data.member_money_list) {
                      this.setData({
                          balanceList: data.member_money_list.map(u => {
                              if (!u.store_name) {
                                  u.store_name = `商铺ID${u.store_id}`
                              }
                              return u;
                          })
                      })
                  }
              }
          })
      })
  }
})