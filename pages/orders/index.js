var app = getApp()
import Order from '../../comm/Order.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    classNavList: [{
      cap: '全部',
      type: 5
		}, {
				cap: '待付款',
				type: 0
			}, {
				cap: '待发货',
				type: 1
			}, {
				cap: '待收货',
				type: 2
			}, {
				cap: '待消费',
				type: 3
			}, {
				cap: '待成团',
				type: 4
			} ],
    classNavActIdx: 5,
    orderList: [],
    showList: []
  },
  /**提醒发货 */
  onRemindShipment(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    let formId = e.detail.formId
    Order.RemindShipment({ ...e.detail.value,
        formId
      })
      .then(r => {
        console.log('Order.RemindShipment => ', r)
        if (r.code == 200) {
          app.SUCCESS(r.message)
        } else {
          app.ERROR(r.message)
        }
      })
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
  /**进入订单详情 */
  goOrderDeatil(e) {
    wx.navigateTo({
      url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}`,
    })
  },
  /**查看物流 */
  showExpress(e) {
    let user_id = e.currentTarget.dataset.user
    let order_id = e.currentTarget.dataset.order
    wx.navigateTo({
      url: `expressdetail?user_id=${user_id}&order_id=${order_id}`,
    })
  },
  /**确认收货 */
  onTakeDelivery(e) {
    app.CONFIME('请在收到货后做此操作，确定已经收到货了吗？', () => {
      Order.TakeDelivery({
          user_id: app.USER_ID(),
          order_id: e.currentTarget.dataset.order
        })
        .then(r => {
          console.log('Order.TakeDelivery => ', r)
          if (r.code == 200) {
            app.msg(r.message)
            this.loadUserOrderList()
          } else {
            app.ERROR(r.message)
          }
        })
    })
  },
  //-- 加载用户订单列表
  loadUserOrderList() {
		let type = this.data.classNavList[this.data.classNavActIdx].type
    Order.List({
      user_id: app.USER_ID(),
      order_type: type
    }).then(r => {
      console.log('Order.List => ', r)
      if (r.code == 200 && r.data.length>0) {
        this.setData({
          orderList: r.data.map(u => {
						u.order_status_txt = app.getOrderStatusTxt(u.order_status)
            u.addtime = TimeConverter.ToLocal(u.addtime);
            u.orderfrm = app.getOrderFrm(u.order_status)
            if (u.order_status == 0) {
              if (u.group_id > 0) {
                u.orderfrm = '拼购'
              }
            }
            u.goods = u.goods.map(item => {
              item.spec_color = item.spec_color.trim()
              item.spec_size = item.spec_size.trim()
              return item
            })
            if (u.paytime) {
              u.paytime = TimeConverter.ToLocal(u.paytime);
            }
            return u;
          })
        }, this.classifyList)
      } else {
				this.setData({
					orderList:[]
				})
      }
    })
  },
  //-- 删除订单
  delOrder(e) {
    app.CONFIME("订单删除后不能恢复，确定删除该订单吗？", () => {
      Order.Delete({
        user_id: app.USER_ID(),
        order_id: e.currentTarget.dataset.order
      }).then(r => {
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
  cancelOrder(e) {
    Order.Cancel({
      user_id: app.USER_ID(),
      order_id: e.currentTarget.dataset.order
    }).then(r => {
      console.log('Order.Cancel => ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message, this.loadUserOrderList)
      } else {
        app.ERROR(r.message)
      }
    })
  },
  //-- 去付款
  toPayOrder(e) {
    wx.navigateTo({
      url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}&type=Pay`
    })
  },
  //-- 去消费
  toConsumeOrder(e) {
    wx.navigateTo({
      url: `/pages/orders/orderdetail?id=${e.currentTarget.dataset.order}&type=Consume`
    })
  },
  //-- 归类列表
  classifyList() {

    //--['全部',0'待付款',1'待发货',2'待收货','待消费','拼团中']
    let classNavActIdx = this.data.classNavActIdx,
      orderList = this.data.orderList;

    let showList = orderList.filter(item => {
      if (classNavActIdx == 0) //-- 全部
      {
        return true;
      }
      if (classNavActIdx == 1) //-- 待付款
      {
        return item.order_status_txt == '待付款';
      }
      if (classNavActIdx == 2) //-- 待发货
      {
        return item.order_status_txt == '待发货';
      }
      if (classNavActIdx == 3) //-- 待收货
      {
        return item.order_status_txt == '待收货';
      }
      if (classNavActIdx == 4) //-- 待消费
      {
        return item.order_status_txt == '待消费';
      }
      if (classNavActIdx == 5) //-- 拼团中
      {
        return item.order_status_txt == '待成团';
      }
    })

    this.setData({
      showList: showList
    })
  },
  //-- 分类导航点击事件
  onClassNavClick(e) {
    this.data.classNavActIdx = e.currentTarget.dataset.idx
    this.setData({
      classNavActIdx: this.data.classNavActIdx
    }, this.loadUserOrderList)
  },
  //-- 去评价
  gotoEvaluate(e) {
    wx.navigateTo({
      url: `/pages/usercenter/comment?stat=0&id=${e.currentTarget.dataset.goods}&order_id=${e.currentTarget.dataset.order}`,
    })
  },
})