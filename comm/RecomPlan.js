import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 推荐方案
 */
let obj = {
  SetRecom() {
    return '/api/recommend/addOrModeRecommend'
  },//-- 设置方案
  SetAward() {
    return '/api/recommend/addOrModeRecomAward'
  },//-- 设置奖励
	RemoveAward() {
		return '/api/Deleteapi/delAwardHandle'
	},//-- 移除奖励
  List() {
    return '/api/recommend/showRecommendList'
  },//-- 方案列表
  Get() {
    return '/api/recommend/showRecommendInfo'
  },//-- 方案详情
	Delete() {
		return '/api/Deleteapi/delRecomHandle'
	},//-- 删除方案
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const RecomPlan = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default RecomPlan