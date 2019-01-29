import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 收货地址
 */
let obj = {
  Get() {
    return '/api/showapi/showUserAddrInfo'
  },
  Post() {
    return '/api/addapi/addUserAddress'
  },
  Delete() {
    return '/api/Deleteapi/delUserAddr'
  },
  List() {
    return '/api/showapi/showUserAddrList'
  },
  SetDef() {
    return '/api/addapi/setAddrDefault'
  },
  async Do(data, showLoadding = true) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, showLoadding)
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