var app = getApp()
import Store from '../../comm/Store.js'
Page({
  data: {
		version:'',
    user: {},
    storeId: 0,
    title: "",
    currGift: {
      startdate: '2018-08-01',
      date: '2018-09-01'
    },
    historyList: [],
    thistoryList: [],
    shop_list: [],
    tshop_list: [],
    sortType: 1
  },
  getSort: function(e) {
    this.setData({
      sortType: e.detail.value
    })
  },
  onLoad: function(options) {
    let today = new Date()
    var currGift = this.data.currGift
    currGift.date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()+1}`
    currGift.startdate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    this.setData({
      storeId: options.id,
      title: options.title,
      currGift: currGift,
      user: app.globalData.user,
			version:app.VERSION()
    })
  },
  scanQR: function(e) {
    let storeId = this.data.storeId
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log('scanQR:', res)
				let [user_id, order_id, order_goods_num, order_goods_id, store_id, order_goods_name ] = res.result.split('-')
				if (!user_id || !order_id || !order_goods_num || !order_goods_id || !store_id){
					app.ERROR(`无法识别，请使用正确的二维码！`)
					return;	
				}
				console.log('EQ Store_Id => ', store_id, storeId)
				if (store_id != storeId){
					app.ERROR(`${order_goods_name}不是本店商品！`)
					return;
				}
				

				Store.ScanQr({ user_id:app.USER_ID(), order_id, order_goods_num, order_goods_id}).then(r=>{
					console.log('Store.ScanQr => ',r)
					if(r.code==200){
						app.SUCCESS(r.message)
					}else{
						app.ERROR(r.message)
					}
				})

      }
    })
  },
  bindStartDateChange: function(e) {
    var currGift = this.data.currGift;
    currGift.startdate = e.detail.value;
    this.setData({
      currGift: currGift
    })
  },
  bindDateChange: function(e) {
    var currGift = this.data.currGift;
    currGift.date = e.detail.value;
    this.setData({
      currGift: currGift
    })
  },
})