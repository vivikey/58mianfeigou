import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商品
 */
let obj = {
  Get() { //-- 获取商品信息
    return '/api/showapi/showShopInfo'
  },
  Post() { //-- 编辑商品
    return '/api/addapi/shopHandle'
  },
  Delete() { //-- 删除商品
    return '/api/Deleteapi/delShop'
  },
  List() { //-- 商品列表
    return '/api/showapi/showShopList'
  },
  TypeList() { //-- 类型列表
    return '/api/showapi/showShopClass'
  },

  async Do(data) {
    let b = true;
    if (this.url.includes('showShopClass')) {
      b = false;
    }
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, b)
    })
  }
}

const Shop = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Shop