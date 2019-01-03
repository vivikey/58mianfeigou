import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 提交订单
 */
let obj = {
  Submit() {
		return '/api/Purchaseapi/submitOrder'
  }, //-- 生成直购订单
	PayOrder() {
		return '/api/Purchaseapi/payOrder'
	}, //-- 确认订单
	OrderAddr() {
		return '/api/Purchaseapi/userModOrderAddr'
	}, //-- 绑定收货地址
	AddNumber() {
		return '/api/Purchaseapi/userAddOrderGoodsNum'
	}, //-- 订单中商品数量增1
	SubNumber() {
		return '/api/Purchaseapi/userSubOrderGoodsNum'
	}, //-- 订单中商品数量减1
	SubmitSingle() {
		return '/api/Purchaseapi/directBuy'
	}, //-- 生成团购订单
	SubmitGroup() {
		return '/api/Purchaseapi/confirmGroupOrder'
	}, //-- 生成团购订单
	JoinGroup() {
		return '/api/Purchaseapi/confirmGroupOrderOther'
	}, //-- 参团生成订单
	ListGroup() {
		return '/api/Purchaseapi/StoreCartInfo'
	}, //-- 列表开团信息
	GetGroup() {
		return '/api/Showapi/groupInfo'
	}, //-- 列表开团信息
	Cancel() {
		return '/api/Purchaseapi/userCancelOrder'
	}, //-- 取消订单
	Delete() {
		return '/api/Purchaseapi/userDelOrder'
	}, //-- 删除订单
	Get() {
		return '/api/Purchaseapi/userOrderInfo'
	}, //-- 查询订单
	GetNoLoading() {
		return '/api/Purchaseapi/userOrderInfo'
	}, //-- 查询订单
	List() {
		return '/api/Purchaseapi/userOrderList'
	}, //-- 用户订单列表
	AcGift() {
		return '/api/Purchaseapi/directGet'
	}, //-- 用户领取赠品
	Express() {
		return '/api/showapi/showUserExpress'
	}, //-- 订单物流
	TakeDelivery() {
		return '/api/Purchaseapi/userOrderFinish'
	}, //-- 确认收货
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  },
	async DoNoLoading(data) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, false)
		})
	}
}

const Order = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
		if (property == "GetNoLoading"){
			return target.DoNoLoading.bind(target)
		}
    return target.Do.bind(target)
  }
})

export default Order