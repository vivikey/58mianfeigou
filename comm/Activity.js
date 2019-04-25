import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 促销活动
 */
let obj = {
	ShowActivityList() {
		return '/api/Activity/showActivityList'
	},//-- 后台-显示活动列表:store_id,user_id
	AddOrModeActivity() {
		return '/api/Activity/addOrModeActivity'
	},//-- 后台-添加修改活动内容
	ShowActivityInfo() {
		return '/api/Activity/showActivityInfo'
	},//-- 后台-显示活动详情
	DeleteActivity() {
		return '/api/Activity/deleteActivity'
	},//-- 后台-删除活动
	IsShowActivity() {
		return '/api/Activity/isShowActivity'
	},//-- 后台-是否前台显示活动
	AddOrModeActivityContent() {
		return '/api/Activity/addOrModeActivityContent'
	},//-- 后台-添加修改参加活动内容的产品
	DeleteActivityContent() {
		return '/api/Activity/deleteActivityContent'
	},//-- 后台-删除活动参与的商品、优惠券、红包等内容
	AddOrModeActivityAward() {
		return '/api/Activity/addOrModeActivityAward'
	},//-- 后台-添加修改活动的奖励
	ShowActivityAward() {
		return '/api/Activity/showActivityAward'
	},//-- 后台-显示活动奖励
	AddOrModeActivityAwardContent() {
		return '/api/Activity/addOrModeActivityAwardContent'
	},//-- 后台-添加修改活动的奖励的内容
	DeleteActivityAwardContent() {
		return '/api/Activity/deleteActivityAwardContent'
	},//-- 后台-删除活动奖励的某一内容
	ShowActivityListAtView() {
		return '/api/Activity/showActivityListAtView'
	},//-- 前台显示- 显示活动列表
	ShowActivityInfoAtView() {
		return '/api/Activity/showActivityInfoAtView'
	},//-- 前台显示-活动详情
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const Activity = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Activity