import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 提交订单
 */
let obj = {
  Submit() {
    return '/api/Purchaseapi/submitOrder'
  }, //-- 生成订单

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