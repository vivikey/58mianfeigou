import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 富文(前端)
 */
let obj = {
  List() {
		return '/api/Addapi/showAdListAtView'
  }, //-- 列表
	Get() {
		return '/api/Addapi/showAdContentInfo'
	},//-- 详情
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const FrontEndFTxt = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default FrontEndFTxt