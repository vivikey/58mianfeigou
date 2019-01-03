import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 海报(前端)
 */
let obj = {
  List() {
		return '/api/showapi/showPosterListAtView'
  }, //-- 列表
	Get() {
		return '/api/showapi/showPosterInfoAtView'
	},//-- 详情
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const FrontEndPoster = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default FrontEndPoster