import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 首页推荐
 */
let obj = {
  GetPoster() {
    return '/api/showapi/showPosterRecommend'
	}, //-- 显示推荐的活动海报
	GetGift() {
		return '/api/showapi/showGiftRecommend'
	}, //-- 显示推荐的实惠赠品
	GetGroup() {
		return '/api/showapi/showGroupRecommend'
	}, //-- 显示推荐的热门团购
	GetShop() {
		return '/api/showapi/showShopRecommend'
	}, //-- 显示推荐的推荐商品
	ListShop() {
		return '/api/showapi/showShopByCondition'
	}, //-- 显示自定义分类商品
	TaskList() {
		return '/api/showapi/showShopBrokerageSort'
	}, //-- 推广任务列表
	ShopSortList() {
		return '/api/showapi/showShopSort'
	}, //-- 商品排序（赠品和拼团）
	TouTiao() {
		return '/api/showapi/showAwardList'
	}, //-- 首页头条
	TypeList() {
		return '/api/showapi/showShopClassAtView'
	}, //-- 首页头条
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const Address = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Address