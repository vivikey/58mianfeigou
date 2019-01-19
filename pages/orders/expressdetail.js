var app=getApp()
import Order from '../../comm/Order.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
	data: {
		version:'',
		user_id:0,
		order_id:0,
		order:{},
		expressList:[]
	},
	onLoad(options) {
		this.data.user_id = options.user_id
		this.data.order_id = options.order_id
	},
	onShow: function () {
		this.setData({
			version:app.VERSION()
		})
		Order.Express({ user_id: this.data.user_id, order_id: this.data.order_id })
			.then(r => {
				console.log('Order.Express => ', r)
				if(r.code==200){
					this.setData({
						expressList:r.data
					})
				}
			})
			this.loadOrderDetail()
	},
	loadOrderDetail: function () {
		Order.Get({ user_id: app.USER_ID(), order_id: this.data.order_id }).then(r => {
			console.log('Order.Get => ', r)
			if (r.code === 200) {
				r.data.addtime = TimeConverter.ToLocal(r.data.addtime)
				r.data.goods = r.data.goods.map(u => {
					u.use_chosed = u.spec_num
					u.can_use = u.spec_num - u.use_num
					return u;
				})
				this.setData({
					order: r.data
				})
			}
		})
	},
})