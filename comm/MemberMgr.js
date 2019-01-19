import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 店铺会员
 */
let obj = {
  SetGrade() {
		return '/api/recommend/storeSetMemberGrade'
  },//-- 设置店铺会员等级
  List() {
		return '/api/recommend/showStoreMemberGradeList'
  },//-- 显示店铺会员等级
	ConFirm() {
		return '/api/recommend/confirmMemberGrade'
  },//-- 启用店铺会员等级制度
	Delete() {
		return '/api/recommend/delStoreMemberGrade'
  },//-- 删除店铺会员等级
	Get() {
		return '/api/recommend/showStoreMemberGradeInfo'
	},//-- 查询店铺会员等级
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const MemberMgr = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default MemberMgr