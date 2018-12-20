import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 提交订单
 */
let obj = {
  Add() {
		return '/api/Purchaseapi/addCartShops'
  }, //-- 增加商品
  Sub() {
		return '/api/Purchaseapi/subCartShops'
  }, //-- 减少商品
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const Cart = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Cart