import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商品规格
 */
let obj = {
    Post() { return '/api/addapi/shopSpecHandle' },
    Delete() { return '/api/Deleteapi/delSpecHandle' },
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const Spec = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Spec