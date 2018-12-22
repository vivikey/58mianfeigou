import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 提交订单
 */
let obj = {
  Submit() {
		return '/api/Purchaseapi/submitOrder'
  }, //-- 生成订单
	PayOrder() {
		return '/api/Purchaseapi/payOrder'
	}, //-- 确认订单
	OrderAddr() {
		return '/api/Purchaseapi/userModOrderAddr'
	}, //-- 确认订单
	SubmitGroup() {
		return '/api/Purchaseapi/confirmGroupOrder'
	}, //-- 开团订单
	List() {
		return '/api/Purchaseapi/userOrderList'
	}, //-- 开团订单
	Cancel() {
		return '/api/Purchaseapi/userCancelOrder'
	}, //-- 取消订单
	Delete() {
		return '/api/Purchaseapi/userDelOrder'
	}, //-- 删除订单
	Get() {
		return '/api/Purchaseapi/userOrderInfo'
	}, //-- 删除订单
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const Order = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Order