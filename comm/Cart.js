import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商铺购物车
 */
let obj = {
  Add() {
		return '/api/Purchaseapi/addCartShops'
  }, //-- 增加商品到购物车
  Sub() {
		return '/api/Purchaseapi/subCartShops'
  }, //-- 从购物车中减少商品
	List() {
		return '/api/Purchaseapi/StoreCartInfo'
	}, //-- 列表
	AddToRecom() {
		return '/api/recommend/addCartShopsByRecom'
	}, //-- 增加商品到购物车
	SubFromRecom() {
		return '/api/recommend/subCartShopsByRecom'
	}, //-- 从购物车中减少商品
	Recom() {
		return '/api/recommend/StoreCartInfoByRecom'
	}, //-- 推荐有奖购物车列表
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	},
	async DoNoLoading(data) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, false)
		})
	}
}

const Cart = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
		if (property == "List") {
			return target.DoNoLoading.bind(target)
		}
    return target.Do.bind(target)
  }
})

export default Cart