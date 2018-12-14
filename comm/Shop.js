import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商品
 */
let obj = {
    Get() { return '/api/showapi/showShopInfo' },
    Post() { return '/api/addapi/shopHandle' },
    Delete() { return '/api/Deleteapi/delShop' },
    List() { return '/api/showapi/showShopList'},
    TypeList() { return '/api/showapi/showShopClass' },
    async Do(data){
        let b = true;
        if (this.url.includes('showShopClass')){
            b=false;
        }
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, b)
        })
    }
}

const Shop = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Shop