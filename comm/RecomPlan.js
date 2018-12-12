import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 推荐方案
 */
let obj = {
    Get() { return '/api/showapi/showRecomInfo' },
    Post() { return '/api/addapi/recommendHandle' },
    Delete() { return '/api/Deleteapi/delRecomHandle' },
    List() { return '/api/showapi/showRecomList'},
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const RecomPlan = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Store