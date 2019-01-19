import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 公共接口
 */
let obj = {
	Login() {
		return '/api/Wxapi/wxLogin'
	},//-- 平台登录
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, false)
    })
  }
}

const Login = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Login