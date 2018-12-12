import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商铺
 */
let obj = {
    Get() { return '/api/showapi/showStoreInfo' },
    Post() { return '/api/addapi/storeHandle' },
    Delete() { return '/api/Deleteapi/delStore' },
    List() { return '/api/showapi/showStoreList'},
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const Store = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Store