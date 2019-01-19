var app = getApp()
import Store from '../../comm/Store.js'
import Order from '../../comm/Order.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    orderList: [],
		store_money:0,
    storeName: '',
    storeId: 0,
		expressList:[],
		currIdx:-1,
		modifyShow:false,
		setShow:false,
		expressCode:'SF',
		inputdata:{
			expressInput: '',
			moneryInput: 0
		}

  },
  onLoad(options) {
    console.log(options)
    this.setData({
      storeName: options.storeName,
      storeId: options.storeId,
      version: app.VERSION()
    })
		Store.ExpressList({user_id:app.USER_ID()}).then(r=>{
			console.log('Store.ExpressList => ',r)
			if(r.code==200){
				this.setData({
					expressList:r.data
				})
			}
		})
  },
	//-- 查看物流
	showExpress(e) {
		let user_id = e.currentTarget.dataset.user
		let order_id = e.currentTarget.dataset.order
		wx.navigateTo({
			url: `expressdetail?user_id=${user_id}&order_id=${order_id}`,
		})
	},
	onInputChange(e){
		let inputdata = this.data.inputdata
		inputdata[e.currentTarget.id] = e.detail.value
		this.setData({
			inputdata: inputdata
		})
	},
	//-- 修改金额
	modifyMonery(e){
		this.setData({
			currIdx:e.currentTarget.dataset.idx,
			modifyShow:true
		})
	},
	hidemodifyWnd(){
		this.setData({
			currIdx: -1,
			modifyShow: false
		})
	},
	//-- 设置物流
	setExpress(e){
		this.setData({
			currIdx: e.currentTarget.dataset.idx,
			setShow: true
		})
	},
	radioChange(e) {
		this.setData({
			expressCode:e.detail.value
		})
	},
	hidesetShow(){
		this.setData({
			currIdx: -1,
			setShow: false
		})	
	},
	onModifyHandle(){

	},
	onSetExpressHandle(){
		let order_id = this.data.orderList[this.data.currIdx].id
		let express_cn = this.data.inputdata.expressInput

		if(express_cn.length<=0){
			app.ERROR("请输入物流单号")
			return;
		}
		Store.AddExpress({
			express_company: this.data.expressCode,
			express_cn, order_id
		}).then(r=>{
			console.log('Store.AddExpress => ',r)
			if(r.code==200){
				app.msg(r.message)
				this.hidesetShow()
				this.getOrderList(this.data.storeId)
			}else{
				app.ERROR(r.message)
			}
		})
	},
  onShow() {
    this.getOrderList(this.data.storeId)
  },
  getOrderList(store_id) {
    Store.OrderList({
        user_id: app.USER_ID(),
        store_id
      })
      .then(r => {
        console.log('Order.OrderList => ', r)
        if (r.code == 200) {
          this.setData({
						orderList: r.data.order_list.map(u=>{
							u.order_status_txt = app.getOrderStatusTxt(u.order_status)
							u.addtime = TimeConverter.ToLocal(u.addtime);
							u.orderfrm = app.getOrderFrm(u.order_status)
							if (u.paytime) {
								u.paytime = TimeConverter.ToLocal(u.paytime);
							}
							return u;
						}),
						store_money: r.data.store_money || 0
          })
        }
      })
  },
})