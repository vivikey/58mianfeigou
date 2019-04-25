import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 前端 - 商铺
 */
let obj = {
  NearBy() {
    return '/api/showapi/showStoreByDistance'
  },
  Get() {
		return '/api/showapi/showStoreInfoAtView'
  },
  CreateAttent() {
    return '/api/addapi/attentStore'
  },
  CancelAttent() {
    return '/api/addapi/cancelAttentStore'
  },
	VogueListAtView() {
		return '/api/showapi/showVogueListAtView'
	},//-- 显示店铺的爆款列表
	ShopListAtView() {
		return '/api/showapi/showShopListAtView'
	},//-- 显示店铺的商品列表
	GroupListAtView() {
		return '/api/showapi/showGroupListAtView'
	},//-- 显示店铺的团购列表
	GiftListAtView() {
		return '/api/showapi/showGiftListAtView'
	}, //-- 显示店铺的赠品列表
  RecomShopList() {
		return '/api/recommend/showRecomShopListAtView'
  },//-- 推荐有奖产品列表
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const FrontEndStore = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default FrontEndStore