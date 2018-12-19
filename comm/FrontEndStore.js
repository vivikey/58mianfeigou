import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 前端 - 商铺
 */
let obj = {
    NearBy() { return '/api/showapi/showStoreByDistance'},
    Get() { return '/api/showapi/showStoreInfo' },
    CreateAttent() { return '/api/addapi/attentStore' },
    CancelAttent() { return '/api/addapi/cancelAttentStore' },
    ShopList() { return '/api/showapi/showShopListAtView' },
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const FrontEndStore = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default FrontEndStore