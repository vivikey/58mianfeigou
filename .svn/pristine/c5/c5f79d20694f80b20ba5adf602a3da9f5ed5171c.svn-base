var app=getApp()
Page({
  data: {
      uid:0,
      store_id:0,
      username:'',
      nowT:'',
      orderList:[]
  },
  onLoad: function (options) {
      this.setData({
          uid:options.id,
          username: options.username,
          store_id:options.store_id
      })
      this.loadUserOrderList(options.id,options.store_id)
  },
  onShow: function () {
      this.setData({
          nowT:new Date().toLocaleString()
      })
  },
  loadUserOrderList:function(uid,storeId){
      app.post('https://m.58daiyan.com/StoreApi/getOrderList',{
          token:app.userInfo().token,
          user_id:uid,
          store_id:storeId
      },res=>{
          if (res.data.data.order_list){
              this.setData({
                  orderList: res.data.data.order_list
              })
          }
      })
  }
})