import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 海报
 */
let obj = {
  UserUploadImg() {
		return '/api/addapi/uploadCheckImg'
  }, //-- 用户上传海报待获得积分
	UserViewImg() {
		return '/api/addapi/showIntegralImgByUser'
	},//-- 用户查看今日已上传的海报数据
	UserList() {
		return '/api/addapi/showIntegralRecordByUser'
	},//-- 用户积分使用记录
	Delete() {
		return '/api/addapi/deleteIntegralImgByStore'
	},//-- 店铺删除用户上传的海报数据
	Check() {
		return '/api/addapi/checkIntegralImgByStore'
	},//-- 店铺审核积分图片
	List() {
		return '/api/addapi/showIntegralImgAtStore'
	},//-- 店铺后台查看积分图片
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const JiFen = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default JiFen