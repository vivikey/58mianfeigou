import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 公共接口
 */
let obj = {
	Login() {
		return '/api/Wxapi/wxLogin'
	},//-- 平台登录
	LoginTest() {
		return '/api/Wxapi/wxLoginTest'
	},//-- 平台登录测试
	LoginSuccess() {
		return '/api/Wxapi/successLogin'
	},//-- 登录成功后调用
	async Do(data, showLoadding = false) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
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