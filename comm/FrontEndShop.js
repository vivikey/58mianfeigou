import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 前端 - 商品
 */
let obj = {
  Get() {
    return '/api/showapi/showShopInfoAtView'
  },
  ShopList() {
    return '/api/showapi/showShopByCondition'
  },
  AddCollect() { //-- 收藏
    return '/api/addapi/userCollectShop'
  },
  RemoveCollect() { //-- 取消收藏
    return '/api/addapi/userCancelCollectShop'
  },
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const FrontEndShop = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default FrontEndShop