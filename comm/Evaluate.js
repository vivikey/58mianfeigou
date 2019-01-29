import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 评价
 */
let obj = {
  PostForGoods() {
    return '/api/addapi/goodsEvaluate'
  },
  ListForGoods() {
    return '/api/showapi/showGoodsEvaluateList'
  },
  PostForStore() {
		return '/api/addapi/storeEvaluate'
  },
  ListForStore() {
		return '/api/showapi/showStoreEvaluateList'
  },
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const Evaluate = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Evaluate