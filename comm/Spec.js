import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商品规格
 */
let obj = {
  Post() {
    return '/api/addapi/shopSpecHandle'
  },
  Delete() {
    return '/api/Deleteapi/delSpecHandle'
  },
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const Spec = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Spec