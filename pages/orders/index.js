var app = getApp()
import Order from '../../comm/Order.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    classNavList: ['全部', '待付款', '待发货', '待收货', '待消费', '拼团中'],
    classNavActIdx: 0,
    orderList: [],
    showList: []
  },

  onLoad: function(options) {
    this.data.version = app.VERSION()
    this.data.classNavActIdx = options.idx || 0
    this.setData({
      version: this.data.version,
      classNavActIdx: this.data.classNavActIdx
    })
  },
  onShow: function() {
    this.loadUserOrderList()
  },

	goOrderDeatil(e){
		wx.navigateTo({
			url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}`,
		})
	},
	getOrderStatusTxt(order_status) {
		switch (order_status){
			case 0:
				return '待付款'
			case 1001:
			case 1021:
				return '待发货'
			case 1011:
			case 2011:
				return '拼团中'
			case 1002:
			case 1012:
			case 1022:
				return '待收货'
			case 2003:
			case 2013:
			case 2023:
				return '待消费'
			default:
				return '已完成'
		}
  },
	//-- 订单来源
	getOrderFrm(order_status){
		switch (order_status) {
			case 1001:
			case 1002:
			case 1003:
			case 2001:
			case 2004:
			case 2003:
				return '直接购买'
			case 1011:
			case 1012:
			case 1013:
			case 2011:
			case 2014:
			case 2013:
				return '拼团'
			case 1021:
			case 1022:
			case 1023:
			case 2021:
			case 2024:
			case 2023:
				return '赠品领取'
		}
	},
  //-- 加载用户订单列表
  loadUserOrderList() {
    Order.List({
      user_id: app.USER_ID()
    }).then(r => {
      console.log('Order.List => ', r)
      if (r.code == 200) {
        this.setData({
          orderList: r.data.map(u => {
            u.order_status_txt = this.getOrderStatusTxt(u.order_status)
            u.addtime = TimeConverter.ToLocal(u.addtime);
						u.orderfrm = this.getOrderFrm(u.order_status)
						if(u.paytime){
							u.paytime = TimeConverter.ToLocal(u.paytime);
						}
            return u;
          })
				}, this.classifyList)
      } else {
        app.ERROR(`获取订单数据失败：${r.message}`)
      }
    })
  },
	//-- 删除订单
	delOrder(e){
		app.CONFIME("订单删除后不能恢复，确定删除该订单吗？", () => {
			Order.Delete({ user_id: app.USER_ID(), order_id: e.currentTarget.dataset.order }).then(r => {
				console.log('Order.Cancel => ', r)
				if (r.code == 200) {
					app.SUCCESS(r.message, this.loadUserOrderList)
				} else {
					app.ERROR(r.message)
				}
			})
		})
	},
	//-- 取消订单
	cancelOrder(e){
		Order.Cancel({user_id:app.USER_ID(),order_id:e.currentTarget.dataset.order}).then(r=>{
			console.log('Order.Cancel => ',r)
			if(r.code==200){
				app.SUCCESS(r.message, this.loadUserOrderList)
			}else{
				app.ERROR(r.message)
			}
		})
	},
	//-- 去付款
	toPayOrder(e){
		wx.navigateTo({
			url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}&type=Pay`
		})
	},
	//-- 去消费
	toConsumeOrder(e){
		wx.navigateTo({
			url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}&type=Consume`
		})
	},
  //-- 归类列表
  classifyList() {

    //--['全部',0'待付款',1'待发货',2'待收货','待消费','拼团中']
    let classNavActIdx = this.data.classNavActIdx,
      orderList = this.data.orderList;
      
		let showList = orderList.filter(item=>{			
			if (classNavActIdx==0) //-- 全部
			{
				return true;
			}
			if (classNavActIdx == 1) //-- 待付款
			{
				return item.order_status_txt == '待付款';
			}
			if (classNavActIdx == 2) //-- 待发货
			{
				return item.order_status_txt == '待发货' ;
			}
			if (classNavActIdx == 3) //-- 待收货
			{
				return item.order_status_txt == '待收货' ;
			}
			if (classNavActIdx == 4) //-- 待消费
			{
				return item.order_status_txt == '待消费';
			}
			if (classNavActIdx == 5) //-- 拼团中
			{
				return item.order_status_txt == '拼团中';
			}
		})

		this.setData({
			showList: showList
		})
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.id
    this.setData({
      classNavActIdx: this.data.classNavActIdx
    }, this.classifyList)
  },
})