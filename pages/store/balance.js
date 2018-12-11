var app=getApp()
Page({
  data: {
      store_id:0,
      store_name:'悟能电子商务有限公司',
      myBalance:0.00,
      moneyDetails:[]
  },
  onLoad: function (options) {
      this.setData({
          store_id: options.store_id,
          store_name: options.store_name
      })
  },
  onShow: function () {
      app.getStoreBalance(this.data.store_id, res => {
          if (res.data.data.money) {
              this.setData({
                  myBalance: res.data.data.money
              })
          }
          app.getStoreMoneyDetails(this.data.store_id,res=>{
              console.log('getStoreMoneyDetails:',res.data)
              if(res.data.data && res.data.data.length>0){
                  this.setData({
                      moneyDetails:res.data.data
                  })
              }
          })
      }) 
  }
})